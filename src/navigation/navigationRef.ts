import { createNavigationContainerRef } from "@react-navigation/native";

// A ref to the root NavigationContainer. This lets code that lives outside
// of any screen (e.g. the global IncomingJobListener that reacts to the
// "job:incoming" socket event) trigger navigation regardless of which
// screen the worker currently has open.
export const navigationRef = createNavigationContainerRef();

export function navigate(name: string, params?: object) {
  if (navigationRef.isReady()) {
    // @ts-ignore - name is dynamic across the whole navigator tree
    navigationRef.navigate(name, params);
  }
}
