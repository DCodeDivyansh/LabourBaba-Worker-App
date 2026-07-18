// src/navigation/RootNavigation.ts
import { createNavigationContainerRef, StackActions } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navigate(name: string, params?: object) {
  if (navigationRef.isReady()) {
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
