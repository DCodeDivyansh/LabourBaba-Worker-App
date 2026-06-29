import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

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
      routes: [{ name: 'MainTabs' }],
    });
  };

  return (
  <View style={styles.container}>
    <TopAppBar title="Verification" />

    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <OtpVerificationContent
          phoneNumber="+91 9876543210"
          onVerify={handleVerify}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});