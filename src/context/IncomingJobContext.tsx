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
import { getIncomingDispatchByRequirement } from '../services/dispatch';
import { getCurrentLocation } from '../services/location';
import { distanceTextBetween } from '../utils/distance';

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

  /**
   * Fetches the full job_dispatch → job_requirement → job → customer chain
   * for this requirement and merges the real customer name, phone, job
   * location, and a client-computed distance into currentJob. Runs after
   * the lightweight native payload has already started the ring/countdown/
   * navigation, so this only ever *upgrades* what's on screen — it never
   * blocks the initial "phone is ringing" moment.
   *
   * Field paths below are confirmed against dispatchServices.ts's
   * getIncomingDispatches(): job_dispatch rows include job_requirement,
   * which includes job, which includes customer.
   */
  const enrichCurrentJob = useCallback(async (jobId: string, requirementId: string) => {
    try {
      const dispatch = await getIncomingDispatchByRequirement(requirementId);
      if (!dispatch) return;

      const jr = dispatch.job_requirement;
      const job = jr?.job;
      const customer = job?.customer;

      const jobLatitude: number | null = job?.latitude ?? null;
      const jobLongitude: number | null = job?.longitude ?? null;

      let distanceText = '--';
      try {
        const workerLoc = await getCurrentLocation();
        distanceText = distanceTextBetween(
          (workerLoc as any)?.latitude,
          (workerLoc as any)?.longitude,
          jobLatitude,
          jobLongitude,
        );
      } catch {
        // Location unavailable (denied/timeout) — leave distanceText as '--'
        // rather than blocking the rest of the enrichment.
      }

      setCurrentJob(prev => {
        // Guard against a stale response landing after the worker already
        // accepted/rejected/timed out, or after a different job arrived.
        if (!prev || prev.jobId !== jobId) return prev;
        return {
          ...prev,
          customerName: customer?.name ?? prev.customerName,
          customerPhone: customer?.phone ?? prev.customerPhone,
          location: job?.location ?? prev.location,
          ratePerDay: jr?.rate_per_day != null ? String(jr.rate_per_day) : prev.ratePerDay,
          body: jr?.skill_type ?? prev.body,
          jobLatitude,
          jobLongitude,
          distanceText,
        };
      });
    } catch (e) {
      console.log('[IncomingJobContext] Failed to enrich job details:', e);
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

    enrichCurrentJob(job.jobId, job.requirementId);
    // enrichCurrentJob intentionally omitted from deps: it's stable
    // (useCallback with empty deps below), including it here would only
    // require reordering without changing behavior.
  }, [clearCountdown, enrichCurrentJob]);

  const clearJob = useCallback(() => {
    clearCountdown();
    setCurrentJob(null);
    resolvedRef.current = true;
  }, [clearCountdown]);

  const notifyBackend = useCallback(
    async (requirementId: string, decision: 'accept' | 'reject') => {
      if (socket.connected) {
        // Socket path — ack callback lets us fall back to REST if the
        // server doesn't confirm within a short window.
        const ackTimeout = setTimeout(() => {
          respondToJobOffer(requirementId, decision).catch(() => { });
        }, 4000);

        socket.emit('job_offer_response', { requirementId, decision }, () => {
          clearTimeout(ackTimeout);
        });
      } else {
        await respondToJobOffer(requirementId, decision);
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

    await notifyBackend(job.requirementId, 'accept');
    navigate('JobDetails', { jobId: job.jobId, requirementId: job.requirementId });
  }, [currentJob, clearJob, notifyBackend]);

  const reject = useCallback(async () => {
    if (!currentJob || resolvedRef.current) return;
    const job = currentJob;
    resolvedRef.current = true;

    IncomingJobBridge.stopRinging();
    await IncomingJobBridge.rejectJob(job.jobId);
    clearJob();

    await notifyBackend(job.requirementId, 'reject');
  }, [currentJob, clearJob, notifyBackend]);

  // Timeout is driven natively (IncomingJobForegroundService's 30s Handler)
  // so it fires reliably even if JS is suspended — this listener just syncs
  // UI state and still notifies the backend. The native event only carries
  // jobId, so requirementId is looked up from currentJob before it's cleared.
  useEffect(() => {
    const sub = IncomingJobBridge.onTimeout(async ({ jobId }) => {
      if (resolvedRef.current || !currentJob || currentJob.jobId !== jobId) return;
      resolvedRef.current = true;
      const requirementId = currentJob.requirementId;
      clearJob();
      await notifyBackend(requirementId, 'reject');
    });
    return () => sub.remove();
  }, [currentJob, clearJob, notifyBackend]);

  // Notification's own inline Accept/Reject buttons (tapped without opening
  // IncomingJobScreen) also need to update JS state and hit the backend.
  // Same requirementId lookup as onTimeout above, for the same reason.
  useEffect(() => {
    const sub = IncomingJobBridge.onDecision(async ({ jobId, decision }) => {
      if (resolvedRef.current || !currentJob || currentJob.jobId !== jobId) return;
      resolvedRef.current = true;
      const requirementId = currentJob.requirementId;
      clearJob();
      await notifyBackend(requirementId, decision);
      if (decision === 'accept') {
        navigate('JobDetails', { jobId, requirementId });
      }
    });
    return () => sub.remove();
  }, [currentJob, clearJob, notifyBackend]);

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