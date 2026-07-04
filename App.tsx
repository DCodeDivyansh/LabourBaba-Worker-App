import React, { useEffect, useState } from 'react';
import BootSplash from 'react-native-bootsplash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Geocoder from 'react-native-geocoding';
import './src/translations/i18n';

Geocoder.init("YOUR_GOOGLE_MAPS_API_KEY");

import AppNavigator from './src/navigation/AppNavigator';
import { OnlineStatusProvider } from './src/api/OnlineStatusContext';
import IncomingJobListener from './src/components/IncomingJobListener';

export default function App() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (token) {
        setInitialRoute('MainTabs');
      } else {
        setInitialRoute('Login');
      }
    } catch (error) {
      setInitialRoute('Login');
    } finally {
      BootSplash.hide({ fade: true });
    }
  };

  if (!initialRoute) {
    return null;
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