import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import TopAppBar from '../../components/TopAppBar';
import AuthHeader from '../../components/AuthHeader';
import OtpVerificationContent from '../../components/OtpVerificationContent';


export default function OtpVerificationScreen() {
  return (
    <View>
      <TopAppBar title="Verification" />
      <OtpVerificationContent
        phoneNumber="+91 9876543210"
        onVerify={(otp) => {
          console.log('OTP:', otp);
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({})