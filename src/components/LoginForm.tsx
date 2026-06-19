import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';


interface LoginFormProps {
  onSendOtp: () => void;
}

const LoginForm = ({
  onSendOtp,
}: LoginFormProps) => {

  const [mobile, setMobile] = useState('');

  return (
    <View style={styles.card}>
      {/* Label */}
      <Text style={styles.label}>Mobile Number</Text>

      {/* Phone Input */}
      <View style={styles.inputContainer}>
        <View style={styles.countryCode}>
          <Text style={styles.countryText}>+91</Text>
        </View>

        <TextInput
          value={mobile}
          onChangeText={setMobile}
          placeholder="Enter your 10-digit number"
          placeholderTextColor="#BBA79D"
          keyboardType="phone-pad"
          maxLength={10}
          style={styles.input}
        />
      </View>

      {/* OTP Button */}
      <TouchableOpacity
        style={styles.otpButton}
        onPress={onSendOtp}
      >
        <Text style={styles.otpText}>Send OTP</Text>
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.dividerContainer}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>
          OR CONTINUE WITH
        </Text>
        <View style={styles.line} />
      </View>

      {/* Google Button */}
      <TouchableOpacity style={styles.googleButton}>
        <Image
          source={require('../../assets/Google_logo.png')}
          style={styles.googleLogo}
        />

        <Text style={styles.googleText}>
          Google Sign In
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginForm;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    height: 360,
    width: '90%',
    alignSelf: 'center',
    marginTop: 20,
    elevation: 6,
    borderRadius: 18,
    paddingHorizontal: 26,
    paddingVertical: 24,
    borderWidth: 1,
    borderColor: '#E2BFB0',
  },

  label: {
    fontSize: 15,
    color: '#2F2F2F',
    marginBottom: 10,
  },

  inputContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#B89A8A',
    borderRadius: 10,
    overflow: 'hidden',
    height: 54,
  },

  countryCode: {
    width: 62,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#B89A8A',
  },

  countryText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },

  input: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#333',
  },

  otpButton: {
    height: 56,
    backgroundColor: '#FF5A00',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 26,

    elevation: 6,

    shadowColor: '#FF5A00',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },

  otpText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 34,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E6D8D0',
  },

  dividerText: {
    marginHorizontal: 14,
    fontSize: 13,
    color: '#6B5A54',
    letterSpacing: 1,
  },

  googleButton: {
    height: 54,
    borderWidth: 1,
    borderColor: '#B89A8A',
    borderRadius: 27,

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  googleLogo: {
    width: 22,
    height: 22,
    marginRight: 12,
  },

  googleText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2F2F2F',
  },
});