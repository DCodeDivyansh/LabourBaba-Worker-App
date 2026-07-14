import { useEffect, useRef } from 'react';
import notifee, { EventType } from '@notifee/react-native';
import { socket } from '../services/socket';
import { navigate, navigationRef } from '../navigation/navigationRef';
import {
  onForegroundMessage,
  onNotificationOpenedApp,
  getInitialNotification,
} from '../services/firebase';
import { createJobOfferChannel } from '../services/notifee';
import { acceptDispatch, declineDispatch } from '../services/dispatch';

export default function IncomingJobListener() {
  const isShowingRef = useRef(false);

  // Creating a channel that already exists is a safe no-op, so it's fine to
  // call this on every mount rather than trying to track "has this run
  // before" across app restarts.
  useEffect(() => {
    createJobOfferChannel();
  }, []);

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

    // FCM's `data` payload arrives as flat string values, not a camelCase
    // job object — map it to the same shape handleIncomingJob expects so
    // both paths converge on identical navigation behavior.
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

    // Accept/Reject tapped directly from the notification while the app is
    // in the foreground — background taps are handled separately in
    // index.js via notifee.onBackgroundEvent.
    const unsubForegroundEvent = notifee.onForegroundEvent(async ({ type, detail }) => {
      const { notification, pressAction } = detail;
      const requirementId = notification?.data?.requirementId;

      if (!requirementId || typeof requirementId !== 'string') return;

      if (type === EventType.ACTION_PRESS && pressAction?.id === 'accept') {
        try {
          await acceptDispatch(requirementId);
        } catch (err) {
          console.log('[notifee foreground] Accept failed:', err);
        }
        if (notification?.id) await notifee.cancelNotification(notification.id);
      }

      if (type === EventType.ACTION_PRESS && pressAction?.id === 'reject') {
        try {
          await declineDispatch(requirementId);
        } catch (err) {
          console.log('[notifee foreground] Reject failed:', err);
        }
        if (notification?.id) await notifee.cancelNotification(notification.id);
      }
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
      unsubForegroundEvent();
      unsubOpened();
    };
  }, []);

  return null;
}