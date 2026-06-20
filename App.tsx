import React, { useEffect } from 'react';
import BootSplash from 'react-native-bootsplash';
import AppNavigator from './src/navigation/AppNavigator';
import LanguageSelectionScreen from './src/screens/profile/LanguageSelectionScreen'

export default function App() {
  useEffect(() => {
    BootSplash.hide({ fade: true });
  }, []);

  return <AppNavigator />;
  // return <LanguageSelectionScreen/>;
}