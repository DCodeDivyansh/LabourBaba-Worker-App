import { StyleSheet, View } from 'react-native';
import React from 'react';

import TopAppBar from '../../components/TopAppBar';
import OtpVerificationContent from '../../components/OtpVerificationContent';

export default function OtpVerificationScreen({
  navigation,
}) {
  const handleVerify = otp => {
    console.log('OTP:', otp);

    // Verify OTP here

    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Dashboard',
        },
      ],
    });
  };

  return (
    <View style={styles.container}>
      <TopAppBar title="Verification" />

      <OtpVerificationContent
        phoneNumber="+91 9876543210"
        onVerify={handleVerify}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});