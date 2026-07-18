// src/navigation/RootNavigation.ts
import { createNavigationContainerRef, StackActions } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

// Queue for navigation calls that arrive before the NavigationContainer has
// finished mounting — this is exactly the race that happens on a cold start
// from a killed app: IncomingJobProvider's mount effect calls
// getInitialIncomingJob() and then navigate('IncomingJobScreen', ...)
// almost immediately, often before navigationRef.isReady() is true.
// Previously that call was just silently dropped, so the job data landed in
// currentJob state correctly but the screen itself never appeared.
type PendingNav = { name: string; params?: object };
let pendingNavigation: PendingNav | null = null;

export function navigate(name: string, params?: object) {
  if (navigationRef.isReady()) {
    (navigationRef as any).navigate(name, params);
  } else {
    // Don't drop it — the container may not be mounted yet on a cold start.
    // Only the most recent pending call is kept, which is correct for this
    // use case (an incoming-job navigation always supersedes anything
    // queued before it).
    pendingNavigation = { name, params };
  }
}

/** Call this from NavigationContainer's onReady prop, once, to flush any
 * navigation call that arrived before the container was ready. */
export function flushPendingNavigation() {
  if (pendingNavigation && navigationRef.isReady()) {
    const { name, params } = pendingNavigation;
    pendingNavigation = null;
    (navigationRef as any).navigate(name, params);
  }
}

// Closes the IncomingJobScreen modal and returns to whatever screen was
// underneath it (dashboard, job list, etc.) — used when an offer is
// declined or times out with no response. Only pops if IncomingJobScreen
// is actually the current route, so this is safe to call defensively.
export function dismissIncomingJob() {
  if (!navigationRef.isReady()) return;
  if (navigationRef.getCurrentRoute()?.name === 'IncomingJobScreen') {
    navigationRef.dispatch(StackActions.pop());
  }
}

// Used when an offer is accepted: swaps IncomingJobScreen out for
// JobDetails in a single stack operation (rather than pushing JobDetails
// on top and leaving the now-empty IncomingJobScreen underneath it in the
// back stack, which would show a blank sheet if the user ever pressed back).
export function replaceWithJobDetails(params: object) {
  if (!navigationRef.isReady()) return;
  if (navigationRef.getCurrentRoute()?.name === 'IncomingJobScreen') {
    navigationRef.dispatch(StackActions.replace('JobDetails', params));
  } else {
    navigate('JobDetails', params);
  }
}