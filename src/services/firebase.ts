import messaging from '@react-native-firebase/messaging';

export async function requestNotificationPermission() {
    const authStatus = await messaging().requestPermission();

    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    return enabled;
}

export async function getFCMToken() {
    try {
        const token = await messaging().getToken();

        console.log("FCM Token:", token);

        return token;
    } catch (err) {
        console.error("Error getting FCM token:", err);
        return null;
    }
}