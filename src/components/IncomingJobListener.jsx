import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { socket } from '../services/socket';
import { navigate, navigationRef } from '../navigation/navigationRef';

/**
 * Mounted once at the root of the app (see App.tsx). It has no UI of its
 * own — it just listens for the "job:incoming" socket event for as long as
 * the app is alive, and pushes the IncomingJob screen on top of whatever
 * screen the worker is currently looking at, exactly like an Uber/Ola
 * incoming-ride popup.
 */
export default function IncomingJobListener() {
  // Guards against showing a second Incoming Job screen on top of another
  // one if two events arrive close together.
  const isShowingRef = useRef(false);

  useEffect(() => {
    const handleIncomingJob = (job) => {
      console.log('========== NEW JOB (global) ==========');
      console.log(job);
      console.log('========================================');

      if (isShowingRef.current) {
        // Already showing an incoming job — ignore further pushes until
        // the current one is resolved (accepted/declined/expired).
        return;
      }

      if (!navigationRef.isReady()) {
        return;
      }

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

    return () => {
      socket.off('job:incoming', handleIncomingJob);
    };
  }, []);

  return null;
}
