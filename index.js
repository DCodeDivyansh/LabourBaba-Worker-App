/**
 * @format
 */

import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import TrackPlayer from 'react-native-track-player';
import App from './App';
import { name as appName } from './app.json';
import { displayJobOfferNotification, createJobOfferChannel } from './src/services/notifee'; // ⬅ CHANGED
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
  // ⬅ NEW: confirms the handler actually fired at all — if this line never
  // shows up in `adb logcat`, the push isn't reaching the device/OS layer,
  // which is a backend/FCM problem, not anything in this file.
  console.log('[FCM background] Handler invoked:', JSON.stringify(remoteMessage?.data));

  try {
    const data = remoteMessage?.data;
    if (!data?.requirementId) {
      console.log('[FCM background] Received message with no requirementId:', remoteMessage);
      return;
    }

    // ⬅ NEW: when the app is fully killed, this background handler runs in
    // a separate "headless" JS context that never mounts App.tsx —
    // meaning IncomingJobListener's channel-creation useEffect never runs
    // here. createChannel() is a safe no-op if it already exists, so it's
    // fine (and necessary) to call it every time right before displaying.
    await createJobOfferChannel();
    console.log('[FCM background] Channel ensured, displaying notification...');

    await displayJobOfferNotification({
      requirementId: String(data.requirementId),
      jobId: String(data.jobId || ''),
      skillType: data.skillType ? String(data.skillType) : undefined,
      ratePerDay: data.ratePerDay ? String(data.ratePerDay) : undefined,
      expiresAt: data.expiresAt ? String(data.expiresAt) : undefined,
    });

    console.log('[FCM background] Notification displayed successfully');
  } catch (err) {
    // ⬅ NEW: previously an error here (e.g. a bad notifee call) would
    // reject silently with nothing in logcat pointing at it. Now it's
    // impossible to miss.
    console.log('[FCM background] FAILED to display notification:', err);
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

// Required by react-native-track-player on Android — backs the foreground
// service that keeps the ringtone playing while the incoming-job screen is
// up. Must be a top-level call, not inside App.tsx.
TrackPlayer.registerPlaybackService(() => require('./src/services/trackPlayerService'));