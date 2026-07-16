import React, { useEffect, useState } from 'react';
import BootSplash from 'react-native-bootsplash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Geocoder from 'react-native-geocoding';
import './src/translations/i18n';
import { checkNotificationPermissionStatus, getFCMToken, onTokenRefresh } from './src/services/firebase'; // ⬅ CHANGED
import { updateDeviceToken } from './src/services/worker'; // ⬅ NEW

Geocoder.init("YOUR_GOOGLE_MAPS_API_KEY");

import AppNavigator from './src/navigation/AppNavigator';
import { OnlineStatusProvider } from './src/api/OnlineStatusContext';
import IncomingJobListener from './src/components/IncomingJobListener';
import SplashScreen from './src/screens/auth/SplashScreen';

export default function App() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    init();
    setupPushNotifications(); // ⬅ CHANGED: replaces the old inline getFCMToken
  }, []);

  // ⬅ NEW: proper permission → token → backend registration flow, plus a
  // listener for token rotation. Only registers the token with the backend
  // if a worker is actually logged in (registering it while logged out would
  // just fail the /me/device-token call's auth check).
  const setupPushNotifications = async () => {
    try {
      // Token rotation can happen any time after permission is granted
      // (including permission granted later from the dashboard popup), so
      // this listener is always registered regardless of current status.
      onTokenRefresh(async (newToken) => {
        const stillLoggedIn = await AsyncStorage.getItem('token');
        if (stillLoggedIn) {
          try {
            await updateDeviceToken(newToken);
          } catch (e) {
            console.log('[Push] Failed to update refreshed token:', e);
          }
        }
      });

      const status = await checkNotificationPermissionStatus();
      if (status !== 'granted') {
        // Don't prompt here — WorkerDashboardScreen fires the native
        // permission dialog directly once the worker lands there.
        console.log('[Push] Notification permission not granted yet:', status);
        return;
      }

      const token = await getFCMToken();
      const authToken = await AsyncStorage.getItem('token');
      if (token && authToken) {
        await updateDeviceToken(token);
      }
    } catch (e) {
      console.log('[Push] Setup error:', e);
    }
  };

  const init = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        setInitialRoute("MainTabs");
      } else {
        setInitialRoute("Login");
      }
    } catch {
      setInitialRoute("Login");
    } finally {
      BootSplash.hide({ fade: true });
    }
  };

  // ⬅ CHANGED: was `return null` — left a blank white/black flash between
  // the native BootSplash hiding and the navigator mounting. Showing the
  // same branded splash here closes that gap.
  if (!initialRoute) {
    return <SplashScreen />;
  }

  return (
    <OnlineStatusProvider>
      <SafeAreaProvider>
        <AppNavigator initialRoute={initialRoute} />
        <IncomingJobListener />
      </SafeAreaProvider>
    </OnlineStatusProvider>
  );
}