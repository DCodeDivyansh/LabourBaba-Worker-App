import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import AuthHeader from '../../components/AuthHeader';
import LoginForm from '../../components/LoginForm';
import FooterLink from '../../components/FooterLink';
import LanguageToggle from '../../components/LanguageToggle';
import { useEffect } from "react";
import { getHealth } from "../../services/health";
import PasswordCard from '../../components/Password';

const LoginScreen = ({ navigation }) => {
  useEffect(() => {
    const load = async () => {
      try {
        const health = await getHealth();
        console.log(health);
      } catch (error) {
        console.log(error);
      }
    };

    load();
  }, []);
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >
      <LanguageToggle />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AuthHeader />

        <LoginForm
          onSendOtp={() =>
            navigation.navigate('OtpVerification')
          }
        />
        
      </ScrollView>

      <FooterLink
        CreateProfile={() =>
          navigation.navigate('CreateProfile')
        }
      />
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F8F7',
  },

  scrollContent: {
    flexGrow: 1,
  },
});