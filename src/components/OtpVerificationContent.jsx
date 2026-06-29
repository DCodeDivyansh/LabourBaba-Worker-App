import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';

import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const OtpVerificationContent = ({
  phoneNumber = '+91 9876543210',
  onVerify,
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (!text && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}

      <Image
        source={require('../../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.tagline}>
        Find&nbsp;&nbsp;Book&nbsp;&nbsp;Build
      </Text>

      {/* Heading */}

      <Text style={styles.heading}>
        Verify Your Number
      </Text>

      <Text style={styles.description}>
        We have sent a 6-digit code to
      </Text>

      <Text style={styles.phone}>
        {phoneNumber}
      </Text>

      {/* OTP */}

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={ref => (inputRefs.current[index] = ref)}
            style={styles.otpBox}
            value={digit}
            maxLength={1}
            keyboardType="number-pad"
            textAlign="center"
            onChangeText={text =>
              handleOtpChange(text, index)
            }
          />
        ))}
      </View>

      {/* Resend */}

      <Text style={styles.infoText}>
        Didn't receive the code?
      </Text>

      <Text style={styles.resendText}>
        Resend in 00:30
      </Text>

      {/* Button */}

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          onVerify?.(otp.join(''))
        }>
        <Text style={styles.buttonText}>
          Verify & Proceed →
        </Text>
      </TouchableOpacity>
      <Text style={styles.termsText}>
        By continuing, you agree to our Terms of Service
        and Privacy Policy.
      </Text>
    </View>
  );
};

export default OtpVerificationContent;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: width * 0.06,
    backgroundColor: '#F8F7F6',
    flex: 1,
  },

  logo: {
    width: width * 0.65,
    height: width * 0.22,
    marginTop: height * 0.04,
  },

  tagline: {
    fontSize: width * 0.045,
    color: '#6B4D41',
    letterSpacing: 1,
    fontWeight: '500',
  },

  heading: {
    marginTop: height * 0.08,
    fontSize: width * 0.055,
    fontWeight: '700',
    color: '#1D1D1D',
  },

  description: {
    marginTop: height * 0.02,
    fontSize: width * 0.038,
    color: '#64748B',
  },

  phone: {
    marginTop: height * 0.01,
    fontSize: width * 0.042,
    color: '#1D1D1D',
    fontWeight: '500',
  },

  otpContainer: {
    flexDirection: 'row',
    marginTop: height * 0.03,
    justifyContent: 'space-between',
    width: '100%',
  },

  otpBox: {
    width: width * 0.12,
    height: width * 0.14,
    borderWidth: 1,
    borderColor: '#E0B8A7',
    borderRadius: width * 0.02,
    fontSize: width * 0.05,
    backgroundColor: '#FFF',
  },

  infoText: {
    marginTop: height * 0.03,
    fontSize: width * 0.04,
    color: '#64748B',
  },

  resendText: {
    marginTop: height * 0.02,
    fontSize: width * 0.04,
    fontWeight: '600',
    color: '#D95A00',
  },

  button: {
    width: '100%',
    height: width * 0.15,
    backgroundColor: '#FF5A00',
    borderRadius: width * 0.035,
    marginTop: height * 0.08,

    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#FF5A00',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: width * 0.045,
    fontWeight: '700',
  },

  termsText: {
    marginTop: height * 0.04,
    fontSize: width * 0.03,
    color: '#64748B',
    textAlign: 'center',
  },
});