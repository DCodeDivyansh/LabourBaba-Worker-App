import notifee, {
  AndroidImportance,
  AndroidVisibility,
  AndroidCategory,
} from '@notifee/react-native';

// ⬅ CHANGED: bumped from 'job-offers' — Android notification channels are
// immutable once created on a device. If this app was ever installed
// before (even a dev build), the OLD 'job-offers' channel is still sitting
// on the phone with whatever settings it had back then, and Android
// silently ignores any sound/importance/vibration changes made in code
// afterwards. This was the #1 reason background notifications weren't
// ringing even though the config here looked correct. Bumping the ID
// forces a genuinely fresh channel; deleteChannel() below also cleans up
// the old one so it doesn't linger as a second, muted entry in Settings.
export const JOB_OFFER_CHANNEL_ID = 'job-offers-v5';
const LEGACY_CHANNEL_IDS = ['job-offers', 'job-offers-v2', 'job-offers-v3', 'job-offers-v4'];

export const JOB_OFFER_CATEGORY_ID = 'job-offer'; // must match `ios.categoryId` below
export const JOB_OFFER_NOTIFICATION_ID = 'job-offer-notification';

export async function createJobOfferChannel() {
  try {
    for (const legacyId of LEGACY_CHANNEL_IDS) {
      await notifee.deleteChannel(legacyId);
    }
  } catch (e) {
    // fine if they never existed
  }

  try {
    await notifee.createChannel({
      id: JOB_OFFER_CHANNEL_ID,
      name: 'Job Offers',
      importance: AndroidImportance.HIGH,
      sound: 'ringtone', // matches android/app/src/main/res/raw/ringtone.mp3 — no file extension here
      vibration: true,
      // ⬅ FIXED: was [0, 400, 200, 400, 600] — 5 values. Android's channel
      // vibrationPattern must be an even-length array (pairs of
      // wait/vibrate ms); the odd count made createChannel() throw on
      // every single build, so this channel never actually existed on the
      // device — see the '[notifee] createChannel failed' log. Changed first
      // element to 1 to ensure it is positive.
      vibrationPattern: [1, 400, 200, 400, 200, 600],
      visibility: AndroidVisibility.PUBLIC,
      bypassDnd: true,
    });
  } catch (e) {
    // ⬅ NEW: don't let a channel-creation failure silently prevent
    // everything downstream (category registration, notification display)
    // from running — log it so it shows up in logcat instead of vanishing.
    console.log('[notifee] createChannel failed:', e);
  }

  // iOS ignores the Accept/Reject `actions` on displayNotification() unless
  // a matching category is registered up front — Android doesn't need this
  // (its actions are defined inline per-notification below).
  try {
    await notifee.setNotificationCategories([
      {
        id: JOB_OFFER_CATEGORY_ID,
        actions: [
          { id: 'accept', title: 'Accept', foreground: true },
          { id: 'reject', title: 'Reject', destructive: true, foreground: false },
        ],
      },
    ]);
  } catch (e) {
    console.log('[notifee] setNotificationCategories failed:', e);
  }
}

export interface JobOfferNotificationData {
  requirementId: string;
  jobId: string;
  skillType?: string;
  ratePerDay?: string;
  expiresAt?: string; // ⬅ NEW: ISO timestamp, used to auto-dismiss the notification
}

export async function displayJobOfferNotification(data: JobOfferNotificationData) {
  // ⬅ NEW: matches the in-app countdown (WAVE_TIMEOUT_S in
  // IncomingJobScreen) so the notification disappears from the tray right
  // around when the offer actually expires, instead of sitting there stale.
  const expiryMs = data.expiresAt ? new Date(data.expiresAt).getTime() : NaN;
  const timeoutAfter = Number.isFinite(expiryMs)
    ? Math.max(1000, expiryMs - Date.now())
    : 30000;

  await notifee.displayNotification({
    id: JOB_OFFER_NOTIFICATION_ID,
    title: 'New Job Alert',
    body: `${data.skillType || 'A job'} needed — ₹${data.ratePerDay || '—'}/day`,
    data: data as unknown as Record<string, string>,
    android: {
      channelId: JOB_OFFER_CHANNEL_ID,
      importance: AndroidImportance.HIGH,
      category: AndroidCategory.CALL, // ⬅ NEW: hints the OS to treat this like an incoming call
      // ⬅ NEW: pops the app straight over the lock screen / whatever's on
      // screen — the actual "rings like Uber" behavior, rather than a
      // silent banner the worker has to notice and tap. Requires the
      // USE_FULL_SCREEN_INTENT manifest permission (added) and the
      // MainActivity showWhenLocked/turnScreenOn flags (added).
      fullScreenAction: { id: 'default' },
      pressAction: { id: 'default' },
      actions: [
        { title: 'Accept', pressAction: { id: 'accept' } },
        { title: 'Reject', pressAction: { id: 'reject' } },
      ],
      autoCancel: false,
      timeoutAfter,
      loopSound: true, // Make notification sound loop (insistent notification)
      ongoing: true, // Prevent notification from being swiped away
    },
    ios: {
      categoryId: JOB_OFFER_CATEGORY_ID,
      sound: 'ringtone.caf',
    },
  });
}
