import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import BootSplash from 'react-native-bootsplash';
import LoginScreen from './src/screens/auth/LoginScreen';

export default function App() {
  useEffect(() => {
    setTimeout(() => {
      BootSplash.hide({ fade: true });
    }, 1000);
  }, []);

  return (
    <View>
      <LoginScreen />
    </View>
  );
}