import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import BootSplash from 'react-native-bootsplash';
import LoginScreen from './src/screens/auth/LoginScreen';
import OtpVerificationScreen from './src/screens/auth/OtpVerificationScreen';
import CreateProfileScreen from './src/screens/auth/CreateProfileScreen';
import LocationCard from './src/components/LocationCard';
import TopAppBar from './src/components/TopAppBar';
import Help from './src/screens/Help';

export default function App() {
  useEffect(() => {
    setTimeout(() => {
      BootSplash.hide({ fade: true });
    }, 1000);
  }, []);

  return (
    <View>
      {/* <TopAppBar title="Location Base" /> */}
      {/* {/* <LocationCard /> */}
      {/* <OtpVerificationScreen />
      <LoginScreen />  */}
      <Help />
    </View>
  );
}