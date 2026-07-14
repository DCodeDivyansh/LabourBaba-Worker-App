/**
 * @format
 */

import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import App from './App';
import { name as appName } from './app.json';
import { displayJobOfferNotification } from './src/services/notifee';
import { acceptDispatch, declineDispatch } from './src/services/dispatch';

// Required for FCM messages arriving while the app is backgrounded or fully
// killed. Must be registered here, outside the React tree, before
// AppRegistry.registerComponent — registering it inside App.tsx instead
// would be too late for cold-start delivery.
//
// Instead of letting the OS auto-display the plain FCM `notification`
// block, we build the notification ourselves via notifee — this is what
// gives us the custom "job-offers" channel, the custom ringtone sound, and
// the in-notification Accept/Reject action buttons.
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  const data = remoteMessage?.data;
  if (data?.requirementId) {
    await displayJobOfferNotification({
      requirementId: String(data.requirementId),
      jobId: String(data.jobId || ''),
      skillType: data.skillType ? String(data.skillType) : undefined,
      ratePerDay: data.ratePerDay ? String(data.ratePerDay) : undefined,
    });
  } else {
    console.log('[FCM background] Received message with no requirementId:', remoteMessage);
  }
});

// Handles Accept/Reject tapped directly from the notification tray while
// the app is backgrounded or fully killed — calls the backend immediately
// without needing to open the app, per spec.
notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail;
  const requirementId = notification?.data?.requirementId;

  if (!requirementId || typeof requirementId !== 'string') {
    return;
  }

  if (type === EventType.ACTION_PRESS && pressAction?.id === 'accept') {
    try {
      await acceptDispatch(requirementId);
    } catch (err) {
      console.log('[notifee background] Accept failed:', err);
    }
    if (notification?.id) {
      await notifee.cancelNotification(notification.id);
    }
  }

  if (type === EventType.ACTION_PRESS && pressAction?.id === 'reject') {
    try {
      await declineDispatch(requirementId);
    } catch (err) {
      console.log('[notifee background] Reject failed:', err);
    }
    if (notification?.id) {
      await notifee.cancelNotification(notification.id);
    }
  }
});

AppRegistry.registerComponent(appName, () => App);