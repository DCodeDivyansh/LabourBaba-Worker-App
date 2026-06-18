import React from 'react';
import {View, StyleSheet} from 'react-native';

import AuthHeader from '../../components/AuthHeader';
import LoginForm from '../../components/LoginForm';
import FooterLink from '../../components/FooterLink';
import LanguageToggle from '../../components/LanguageToggle';

const LoginScreen = () => {
  return (
    <View>
      <LanguageToggle />
      <View>
        <AuthHeader />
        <LoginForm />
      </View>
      <FooterLink />
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F4F1',
    justifyContent: 'space-between',
  },
});