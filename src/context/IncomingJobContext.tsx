import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AppState } from 'react-native';
import {
  IncomingJobBridge,
  IncomingJobPayload,
} from '../native/IncomingJobBridge';

import { socket } from '../services/socket';
import { respondToJobOffer } from '../services/api';

// ⚠️ Adjust to your actual navigation ref utility (commonly a RootNavigation
// helper wrapping a NavigationContainer ref). Must be callable outside of
// any component tree, since native events can fire before a screen mounts.
import { navigate } from '../navigation/RootNavigation';

const COUNTDOWN_SECONDS = 30;

interface IncomingJobContextValue {
  currentJob: IncomingJobPayload | null;
  secondsRemaining: number;
  accept: () => Promise<void>;
  reject: () => Promise<void>;
}

const IncomingJobContext = createContext<IncomingJobContextValue | null>(null);

export function useIncomingJob(): IncomingJobContextValue {
  const ctx = useContext(IncomingJobContext);
  if (!ctx) {
    throw new Error('useIncomingJob must be used within IncomingJobProvider');
  }
  return ctx;
}

export function IncomingJobProvider({ children }: { children: React.ReactNode }) {
  const [currentJob, setCurrentJob] = useState<IncomingJobPayload | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState(COUNTDOWN_SECONDS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resolvedRef = useRef(false); // guards against double accept/reject/timeout

  const clearCountdown = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startCountdownFor = useCallback((job: IncomingJobPayload) => {
    resolvedRef.current = false;
    setCurrentJob(job);

    const expiresAtMs = job.expiresAt ? new Date(job.expiresAt).getTime() : NaN;
    const initialRemaining = Number.isFinite(expiresAtMs)
      ? Math.max(0, Math.round((expiresAtMs - Date.now()) / 1000))
      : COUNTDOWN_SECONDS;
    setSecondsRemaining(initialRemaining);

    clearCountdown();
    intervalRef.current = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearCountdown();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    navigate('IncomingJobScreen', { jobId: job.jobId });
  }, [clearCountdown]);

  const clearJob = useCallback(() => {
    clearCountdown();
    setCurrentJob(null);
    resolvedRef.current = true;
  }, [clearCountdown]);

  const notifyBackend = useCallback(
    async (jobId: string, decision: 'accept' | 'reject') => {
      if (socket.connected) {
        // Socket path — ack callback lets us fall back to REST if the
        // server doesn't confirm within a short window.
        const ackTimeout = setTimeout(() => {
          respondToJobOffer(jobId, decision).catch(() => {});
        }, 4000);

        socket.emit('job_offer_response', { jobId, decision }, () => {
          clearTimeout(ackTimeout);
        });
      } else {
        await respondToJobOffer(jobId, decision);
      }
    },
    []
  );

  const accept = useCallback(async () => {
    if (!currentJob || resolvedRef.current) return;
    const job = currentJob;
    resolvedRef.current = true;

    IncomingJobBridge.stopRinging();
    await IncomingJobBridge.acceptJob(job.jobId);
    clearJob();

    await notifyBackend(job.jobId, 'accept');
    navigate('JobDetails', { jobId: job.jobId, requirementId: job.requirementId });
  }, [currentJob, clearJob, notifyBackend]);

  const reject = useCallback(async () => {
    if (!currentJob || resolvedRef.current) return;
    const job = currentJob;
    resolvedRef.current = true;

    IncomingJobBridge.stopRinging();
    await IncomingJobBridge.rejectJob(job.jobId);
    clearJob();

    await notifyBackend(job.jobId, 'reject');
  }, [currentJob, clearJob, notifyBackend]);

  // Timeout is driven natively (IncomingJobForegroundService's 30s Handler)
  // so it fires reliably even if JS is suspended — this listener just syncs
  // UI state and still notifies the backend.
  useEffect(() => {
    const sub = IncomingJobBridge.onTimeout(async ({ jobId }) => {
      if (resolvedRef.current || !currentJob || currentJob.jobId !== jobId) return;
      resolvedRef.current = true;
      clearJob();
      await notifyBackend(jobId, 'reject');
    });
    return () => sub.remove();
  }, [currentJob, clearJob, notifyBackend]);

  // Notification's own inline Accept/Reject buttons (tapped without opening
  // IncomingJobScreen) also need to update JS state and hit the backend.
  useEffect(() => {
    const sub = IncomingJobBridge.onDecision(async ({ jobId, decision }) => {
      if (resolvedRef.current) return;
      resolvedRef.current = true;
      clearJob();
      await notifyBackend(jobId, decision);
      if (decision === 'accept') {
        navigate('JobDetails', { jobId });
      }
    });
    return () => sub.remove();
  }, [clearJob, notifyBackend]);

  // Live event: app is foreground/background (not killed) when the job lands.
  useEffect(() => {
    const sub = IncomingJobBridge.onIncomingJob(job => {
      startCountdownFor(job);
    });
    return () => sub.remove();
  }, [startCountdownFor]);

  // Cold-start recovery + re-check on every foreground transition, in case a
  // job arrived while backgrounded and the live event was missed.
  useEffect(() => {
    let cancelled = false;

    const checkPending = async () => {
      const job = await IncomingJobBridge.getInitialIncomingJob();
      if (!cancelled && job && (!currentJob || currentJob.jobId !== job.jobId)) {
        startCountdownFor(job);
      }
    };

    checkPending();

    const appStateSub = AppState.addEventListener('change', state => {
      if (state === 'active') checkPending();
    });

    return () => {
      cancelled = true;
      appStateSub.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <IncomingJobContext.Provider value={{ currentJob, secondsRemaining, accept, reject }}>
      {children}
    </IncomingJobContext.Provider>
  );
}