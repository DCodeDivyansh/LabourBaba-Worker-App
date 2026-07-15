import notifee, { AndroidImportance, AndroidVisibility } from '@notifee/react-native';

export const JOB_OFFER_CHANNEL_ID = 'job-offers';

export async function createJobOfferChannel() {
  await notifee.createChannel({
    id: JOB_OFFER_CHANNEL_ID,
    name: 'Job Offers',
    importance: AndroidImportance.HIGH,
    sound: 'ringtone', // matches android/app/src/main/res/raw/ringtone.mp3 — no file extension here
    vibration: true,
    // ⬅ FIXED: was [0, 400, 200, 400, 600] — 5 values, an odd count, which
    // notifee rejects outright ('expected an array containing an even
    // number of positive values'). The array must alternate
    // pause/vibrate/pause/vibrate/... in pairs. This was silently crashing
    // createChannel() on every app launch, meaning the "job-offers" channel
    // never actually got created — which is the real reason no custom
    // ringtone sound was playing on background/killed notifications.
    vibrationPattern: [0, 400, 200, 400, 200, 600],
    visibility: AndroidVisibility.PUBLIC,
    bypassDnd: true,
  });
}

export interface JobOfferNotificationData {
  requirementId: string;
  jobId: string;
  skillType?: string;
  ratePerDay?: string;
}

export async function displayJobOfferNotification(data: JobOfferNotificationData) {
  await notifee.displayNotification({
    title: 'New Job Alert',
    body: `${data.skillType || 'A job'} needed — ₹${data.ratePerDay || '—'}/day`,
    data: data as unknown as Record<string, string>,
    android: {
      channelId: JOB_OFFER_CHANNEL_ID,
      importance: AndroidImportance.HIGH,
      pressAction: { id: 'default' },
      actions: [
        { title: 'Accept', pressAction: { id: 'accept' } },
        { title: 'Reject', pressAction: { id: 'reject' } },
      ],
      autoCancel: false,
    },
    ios: {
      categoryId: 'job-offer',
      sound: 'ringtone.caf',
    },
  });
}