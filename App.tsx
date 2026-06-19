import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { StyleSheet } from 'react-native';
import BootSplash from 'react-native-bootsplash';
import LoginScreen from './src/screens/auth/LoginScreen';
import OtpVerificationScreen from './src/screens/auth/OtpVerificationScreen';
import CreateProfileScreen from './src/screens/auth/CreateProfileScreen';
import WorkerDashboardScreen from './src/screens/jobs/WorkerDashboardScreen '

export default function App() {
  useEffect(() => {
    setTimeout(() => {
      BootSplash.hide({ fade: true });
    }, 1000);
  }, []);

  return (
    <View>
      <WorkerDashboardScreen />
      {/* <CreateProfileScreen /> */}
      {/* <OtpVerificationScreen /> */}
      {/* <LoginScreen /> */}
    </View>
  );
}

const styles = StyleSheet.create({});