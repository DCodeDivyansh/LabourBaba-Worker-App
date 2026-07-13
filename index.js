/**
 * @format
 */

import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import { name as appName } from './app.json';

// ⬅ NEW: required for FCM messages arriving while the app is backgrounded
// or fully killed. Must be registered here, outside the React tree, before
// AppRegistry.registerComponent — registering it inside App.tsx instead
// would be too late for cold-start delivery.
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('[FCM background]', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);