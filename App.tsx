import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import BootSplash from 'react-native-bootsplash';
import LoginScreen from './src/screens/auth/LoginScreen';
import OtpVerificationScreen from './src/screens/auth/OtpVerificationScreen';
import CreateProfileScreen from './src/screens/auth/CreateProfileScreen';
import Help from './src/screens/Help';
import Review from './src/screens/Review';

export default function App() {
  useEffect(() => {
    setTimeout(() => {
      BootSplash.hide({ fade: true });
    }, 1000);
  }, []);

  return (
    <View style={{flex:1}}> 
      {/* <CreateProfileScreen /> */}
      {/* <OtpVerificationScreen /> */}
      {/* <LoginScreen /> */}
      {/* <Help /> */}
      <Review />
    </View>
  );
}