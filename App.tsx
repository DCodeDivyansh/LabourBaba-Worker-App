import React, { useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { StyleSheet } from 'react-native';
import BootSplash from 'react-native-bootsplash';
import LoginScreen from './src/screens/auth/LoginScreen';
import OtpVerificationScreen from './src/screens/auth/OtpVerificationScreen';
import CreateProfileScreen from './src/screens/auth/CreateProfileScreen';
import Help from './src/screens/Help';
import Review from './src/screens/Review';
import WorkerDashboardScreen from './src/screens/jobs/WorkerDashboardScreen '
import JobsHistory from './src/screens/jobs/JobsHistory'
import AlertScreen from './src/screens/jobs/AlertsScreen'
import ProfileScreen from './src/screens/jobs/ProfileScreen'

export default function App() {
  useEffect(() => {
    setTimeout(() => {
      BootSplash.hide({ fade: true });
    }, 1000);
  }, []);

  return (
    <View style={{flex:1}}> 
    <View style={styles.container}>
      <ProfileScreen />
      {/* <AlertScreen /> */}
      {/* <WorkerDashboardScreen /> */}
      {/* <CreateProfileScreen /> */}
      {/* <OtpVerificationScreen /> */}
      {/* <LoginScreen /> */}
      {/* <Help /> */}
      {/* <Review /> */}
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});