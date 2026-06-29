import React, { useEffect } from 'react';
import BootSplash from 'react-native-bootsplash';
import AppNavigator from './src/navigation/AppNavigator';
import LanguageSelectionScreen from './src/screens/profile/LanguageSelectionScreen';
import JobDetailsScreen from './src/screens/OtherPages/CancelJobPage'
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  useEffect(() => {
    BootSplash.hide({ fade: true });
  }, []);

  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}