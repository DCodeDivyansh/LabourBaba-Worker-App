import messaging from '@react-native-firebase/messaging';
import { checkNotifications, requestNotifications, openSettings } from 'react-native-permissions';

// 'granted' -> can send notifications. 'denied' -> not yet decided, or user
// said no but the OS dialog can still be shown again. 'blocked' -> user
// permanently denied (Android "Don't ask again" / iOS after first refusal) —
// re-requesting silently does nothing; the only way forward is Settings.
export type NotificationPermissionStatus = 'granted' | 'denied' | 'blocked' | 'unavailable';

function normalize(status: string): NotificationPermissionStatus {
    if (status === 'limited') return 'granted'; // iOS provisional/limited counts as usable
    return status as NotificationPermissionStatus;
}

// Read-only — never triggers the native dialog. Safe to call on every focus.
export async function checkNotificationPermissionStatus(): Promise<NotificationPermissionStatus> {
    const { status } = await checkNotifications();
    return normalize(status);
}

// Triggers the native OS permission dialog. Only call this from a screen
// where the user just tapped an explicit "Enable Notifications" CTA — never
// silently on app boot.
export async function requestNotificationPermission(): Promise<NotificationPermissionStatus> {
    const { status } = await requestNotifications(['alert', 'sound', 'badge']);
    return normalize(status);
}

// Deep-links to the app's OS settings page — the only way to flip a
// 'blocked' permission back on.
export function openNotificationSettings(): Promise<void> {
    return openSettings('notifications');
}

export async function getFCMToken(): Promise<string | null> {
    try {
        const token = await messaging().getToken();
        return token;
    } catch (err) {
        console.error('[firebase] Error getting FCM token:', err);
        return null;
    }
}

// ⬅ NEW: FCM tokens rotate — call this once near app root so a refreshed
// token gets re-sent to the backend automatically.
export function onTokenRefresh(callback: (token: string) => void) {
    return messaging().onTokenRefresh(callback);
}

// ⬅ NEW: foreground messages don't auto-display in the system tray — the
// caller decides what to do (here, we just re-navigate the same way the
// socket event does).
export function onForegroundMessage(callback: (remoteMessage: any) => void) {
    return messaging().onMessage(callback);
}

// ⬅ NEW: fires when the worker taps a notification while the app was
// backgrounded (not killed).
export function onNotificationOpenedApp(callback: (remoteMessage: any) => void) {
    return messaging().onNotificationOpenedApp(callback);
}

// ⬅ NEW: fires once, on cold start, if the app was launched by tapping a
// notification while fully killed.
export async function getInitialNotification() {
    return messaging().getInitialNotification();
}


export async function hasNotificationPermission(): Promise<boolean> {
    const status = await checkNotificationPermissionStatus();
    return status === 'granted';
}