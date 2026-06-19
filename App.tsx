import React, { useEffect } from 'react';
import BootSplash from 'react-native-bootsplash';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  useEffect(() => {
    BootSplash.hide({ fade: true });
  }, []);

  return <AppNavigator />;
}