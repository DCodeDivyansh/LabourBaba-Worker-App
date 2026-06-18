import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';

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
    paddingHorizontal: 24,
    backgroundColor: '#F8F7F6',
  },

  logo: {
    width: 260,
    height: 90,
    marginTop: 30,
  },

  tagline: {
    fontSize: 18,
    color: '#6B4D41',
    letterSpacing: 1,
    marginTop: 0,
    fontWeight: '500',
  },

  heading: {
    marginTop: 65,
    fontSize: 22,
    fontWeight: '700',
    color: '#1D1D1D',
  },

  description: {
    marginTop: 18,
    fontSize: 15,
    color: '#64748B',
  },

  phone: {
    marginTop: 8,
    fontSize: 16,
    color: '#1D1D1D',
    fontWeight: '500',
  },

  otpContainer: {
    flexDirection: 'row',
    marginTop: 25,
    gap: 10,
  },

  otpBox: {
    width: 48,
    height: 56,
    borderWidth: 1,
    borderColor: '#E0B8A7',
    borderRadius: 8,
    fontSize: 20,
    backgroundColor: '#FFF',
  },

  infoText: {
    marginTop: 25,
    fontSize: 16,
    color: '#64748B',
  },

  resendText: {
    marginTop: 18,
    fontSize: 16,
    fontWeight: '600',
    color: '#D95A00',
  },

  button: {
    width: '100%',
    height: 58,
    backgroundColor: '#FF5A00',
    borderRadius: 14,
    marginTop: 65,

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
    fontSize: 18,
    fontWeight: '700',
  },

  termsText: {
    top: 160,
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
});