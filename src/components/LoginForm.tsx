import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { Dimensions } from 'react-native';


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



const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  card: {
  backgroundColor: '#ffffff',
  width: '90%',
  alignSelf: 'center',
  marginTop: 16,
  elevation: 6,
  borderRadius: 18,
  paddingHorizontal: 20,
  paddingVertical: 20,
  borderWidth: 1,
  borderColor: '#E2BFB0',
},

  label: {
    fontSize: width * 0.038,
    color: '#2F2F2F',
    marginBottom: width * 0.025,
  },

  inputContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#B89A8A',
    borderRadius: width * 0.025,
    overflow: 'hidden',
    height: width * 0.14,
  },

  countryCode: {
    width: width * 0.16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#B89A8A',
  },

  countryText: {
    fontSize: width * 0.04,
    color: '#333',
    fontWeight: '500',
  },

  input: {
    flex: 1,
    paddingHorizontal: width * 0.04,
    fontSize: width * 0.038,
    color: '#333',
  },

  otpButton: {
    height: width * 0.145,
    backgroundColor: '#FF5A00',
    borderRadius: width * 0.072,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: width * 0.065,

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
    fontSize: width * 0.044,
    fontWeight: '700',
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: width * 0.085,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E6D8D0',
  },

  dividerText: {
    marginHorizontal: width * 0.03,
    fontSize: width * 0.032,
    color: '#6B5A54',
    letterSpacing: 1,
  },

  googleButton: {
    height: width * 0.14,
    borderWidth: 1,
    borderColor: '#B89A8A',
    borderRadius: width * 0.07,

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  googleLogo: {
    width: width * 0.055,
    height: width * 0.055,
    marginRight: width * 0.03,
  },

  googleText: {
    fontSize: width * 0.038,
    fontWeight: '600',
    color: '#2F2F2F',
  },
});