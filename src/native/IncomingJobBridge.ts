import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

export interface IncomingJobPayload {
  jobId: string;
  requirementId: string;
  title: string;
  body: string;
  ratePerDay: string;
  customerName: string;
  location: string;
  expiresAt: string;
}

export interface IncomingJobDecisionEvent {
  jobId: string;
  decision: 'accept' | 'reject';
}

interface IncomingJobNativeModule {
  getInitialIncomingJob(): Promise<IncomingJobPayload | null>;
  stopRinging(): void;
  acceptJob(jobId: string): Promise<boolean>;
  rejectJob(jobId: string): Promise<boolean>;
  addListener(eventName: string): void;
  removeListeners(count: number): void;
}

const isAndroid = Platform.OS === 'android';

// On iOS this module doesn't exist yet (this build is Android-first per the
// spec) — guard every call so importing this file on iOS doesn't crash.
const NativeModule: IncomingJobNativeModule | null = isAndroid
  ? (NativeModules.IncomingJobModule as IncomingJobNativeModule)
  : null;

const emitter = NativeModule ? new NativeEventEmitter(NativeModules.IncomingJobModule) : null;

export const IncomingJobBridge = {
  /**
   * Call once on app start (e.g. inside IncomingJobContext's mount effect).
   * Recovers a job payload that arrived while the app was killed and the
   * native layer had nowhere to emit a JS event to yet.
   */
  async getInitialIncomingJob(): Promise<IncomingJobPayload | null> {
    if (!NativeModule) return null;
    try {
      return await NativeModule.getInitialIncomingJob();
    } catch {
      return null;
    }
  },

  stopRinging(): void {
    NativeModule?.stopRinging();
  },

  async acceptJob(jobId: string): Promise<void> {
    if (!NativeModule) return;
    try {
      await NativeModule.acceptJob(jobId);
    } catch {
      // native stop already best-effort; swallow so JS-side accept flow
      // (socket/API call) still proceeds even if the native stop failed.
    }
  },

  async rejectJob(jobId: string): Promise<void> {
    if (!NativeModule) return;
    try {
      await NativeModule.rejectJob(jobId);
    } catch {
      // see acceptJob note
    }
  },

  /** Fires while the app is foreground/backgrounded (not killed) and a new
   * job notification is posted natively. */
  onIncomingJob(handler: (payload: IncomingJobPayload) => void) {
    if (!emitter) return { remove: () => {} };
    return emitter.addListener('onIncomingJob', handler);
  },

  /** Fires when the native 30s countdown expires with no response. */
  onTimeout(handler: (event: { jobId: string }) => void) {
    if (!emitter) return { remove: () => {} };
    return emitter.addListener('onIncomingJobTimeout', handler);
  },

  /** Fires when the worker taps Accept/Reject on the notification itself
   * (not inside IncomingJobScreen). */
  onDecision(handler: (event: IncomingJobDecisionEvent) => void) {
    if (!emitter) return { remove: () => {} };
    return emitter.addListener('onIncomingJobDecision', handler);
  },
};