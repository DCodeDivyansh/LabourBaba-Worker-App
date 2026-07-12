import { DeviceEventEmitter } from 'react-native';

export const EVENTS = {
  JOB_COMPLETED: 'job:completed',
  JOB_CANCELLED: 'job:cancelled', // ⬅ NEW
};

export const emitJobCompleted = (bookingId) => {
  DeviceEventEmitter.emit(EVENTS.JOB_COMPLETED, { bookingId });
};

export const onJobCompleted = (callback) => {
  const subscription = DeviceEventEmitter.addListener(EVENTS.JOB_COMPLETED, callback);
  return () => subscription.remove();
};

// ⬅ NEW
export const emitJobCancelled = (bookingId) => {
  DeviceEventEmitter.emit(EVENTS.JOB_CANCELLED, { bookingId });
};

export const onJobCancelled = (callback) => {
  const subscription = DeviceEventEmitter.addListener(EVENTS.JOB_CANCELLED, callback);
  return () => subscription.remove();
};