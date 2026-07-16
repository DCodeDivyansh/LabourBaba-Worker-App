import { Vibration } from 'react-native';
import notifee from '@notifee/react-native';
import { displayJobOfferNotification, JOB_OFFER_NOTIFICATION_ID } from './notifee';

export const startRinging = (jobData?: any) => {
  console.log('[ringtone] startRinging() called using Notifee only');
  
  // Trigger vibration pattern in foreground for immediate haptic feedback
  Vibration.vibrate([1, 400, 200, 400, 200, 600], true);

  if (jobData && jobData.requirementId) {
    displayJobOfferNotification(jobData).catch(err => {
      console.log('[ringtone] Failed to display notification in startRinging:', err);
    });
  } else {
    console.log('[ringtone] startRinging called without job data, relying on background notification for audio');
  }
};

export const stopRinging = () => {
  console.log('[ringtone] stopRinging() called using Notifee only');
  Vibration.cancel();
  notifee.cancelNotification(JOB_OFFER_NOTIFICATION_ID).catch(err => {
    console.log('[ringtone] Failed to cancel notification in stopRinging:', err);
  });
};