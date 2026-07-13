import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { socket } from '../services/socket';
import { navigate, navigationRef } from '../navigation/navigationRef';
import { onForegroundMessage, onNotificationOpenedApp, getInitialNotification } from '../services/firebase'; // ⬅ NEW

export default function IncomingJobListener() {
  const isShowingRef = useRef(false);

  useEffect(() => {
    const handleIncomingJob = (job) => {
      if (isShowingRef.current) return;
      if (!navigationRef.isReady()) return;

      isShowingRef.current = true;

      navigate('IncomingJob', {
        requirementId: job?.requirementId,
        jobId: job?.jobId,
        skillType: job?.skillType,
        ratePerDay: job?.ratePerDay,
        expiresAt: job?.expiresAt,
        onResolved: () => {
          isShowingRef.current = false;
        },
      });
    };

    socket.on('job:incoming', handleIncomingJob);

    // ⬅ NEW: FCM's `data` payload arrives as flat string values, not
    // camelCase job object — map it to the same shape handleIncomingJob
    // expects so both paths converge on identical navigation behavior.
    const mapRemoteMessageToJob = (remoteMessage) => ({
      requirementId: remoteMessage?.data?.requirementId,
      jobId: remoteMessage?.data?.jobId,
      skillType: remoteMessage?.data?.skillType,
      ratePerDay: remoteMessage?.data?.ratePerDay,
      expiresAt: remoteMessage?.data?.expiresAt,
    });

    // Foreground fallback — the socket should normally handle this while
    // the app is open, but this guards against a momentarily dropped
    // socket connection (e.g. right after returning from background).
    const unsubForeground = onForegroundMessage((remoteMessage) => {
      handleIncomingJob(mapRemoteMessageToJob(remoteMessage));
    });

    // Tapped while app was backgrounded (not killed).
    const unsubOpened = onNotificationOpenedApp((remoteMessage) => {
      handleIncomingJob(mapRemoteMessageToJob(remoteMessage));
    });

    // Tapped while app was fully killed — cold start case.
    getInitialNotification().then((remoteMessage) => {
      if (remoteMessage) {
        handleIncomingJob(mapRemoteMessageToJob(remoteMessage));
      }
    });

    return () => {
      socket.off('job:incoming', handleIncomingJob);
      unsubForeground();
      unsubOpened();
    };
  }, []);

  return null;
}