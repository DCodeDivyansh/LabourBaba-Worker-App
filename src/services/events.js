import { DeviceEventEmitter } from 'react-native';

// Central place for cross-screen, in-app events.
// Using RN's built-in DeviceEventEmitter — no extra dependency required.

export const EVENTS = {
  JOB_COMPLETED: 'job:completed',
};

export const emitJobCompleted = (bookingId) => {
  DeviceEventEmitter.emit(EVENTS.JOB_COMPLETED, { bookingId });
};

export const onJobCompleted = (callback) => {
  const subscription = DeviceEventEmitter.addListener(EVENTS.JOB_COMPLETED, callback);
  return () => subscription.remove();
};