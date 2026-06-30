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
import { Alert } from 'react-native';
import { workerLogin } from '../../services/login';

const LoginScreen = ({ navigation }: any) => {
  const handleLogin = async (
    mobile: string,
    password: string,
  ) => {
    try {
      const response = await workerLogin({
        phone: `${mobile}`,
        password,
      });

      console.log(response);

      if (response.success) {
        navigation.reset({
          index: 0,
          routes: [{ name: "MainTabs" }],
        });

        // Save response.token using AsyncStorage later
      } else {
        Alert.alert('Login Failed', response.message);
      }
    } catch (error: any) {
      console.log(error.response?.data);

      Alert.alert(
        'Error',
        error.response?.data?.message ??
        'Something went wrong',
      );
    }
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={60}>
      <LanguageToggle />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AuthHeader />

        <LoginForm
          onLogin={handleLogin}
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
    paddingBottom: 120,
  },
});