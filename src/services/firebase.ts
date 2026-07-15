import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';

export async function requestNotificationPermission(): Promise<boolean> {
    if (Platform.OS === 'ios') {
        const authStatus = await messaging().requestPermission();
        return (
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL
        );
    }
    // Android 13+ requires POST_NOTIFICATIONS at runtime; RNFirebase's
    // requestPermission() covers this too.
    const authStatus = await messaging().requestPermission();
    return (
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL
    );
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
    const authStatus = await messaging().requestPermission();

    return (
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL
    );
}