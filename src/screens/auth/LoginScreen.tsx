import React from 'react';
import {
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AuthHeader from '../../components/AuthHeader';
import LoginForm from '../../components/LoginForm';
import FooterLink from '../../components/FooterLink';
import LanguageToggle from '../../components/LanguageToggle';
import { Alert } from 'react-native';
import { workerLogin } from '../../services/login';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { socket } from "../../services/socket";

const LoginScreen = ({ navigation }: any) => {
  const handleLogin = async (mobile: string, password: string) => {
    try {
      const response = await workerLogin({
        phone: `${mobile}`,
        password,
      });

      console.log(response);

      if (response.success) {
        await AsyncStorage.setItem('token', response.token);
        await AsyncStorage.setItem('worker', JSON.stringify(response.data));

        // socket.connect();
        // socket.on("connect", () => {
        //   console.log("Socket Connected:", socket.id);
        //   socket.emit("join:worker", response.data.id);
        //   console.log("Joined worker room:", response.data.id);
        // });

        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }],
        });
      } else {
        Alert.alert('Login Failed', response.message);
      }
    } catch (error: any) {
      console.log('========== ERROR ==========');
      console.log('Status:', error.response?.status);
      console.log('Data:', error.response?.data);
      console.log('Message:', error.message);
      console.log('Config:', error.config);

      Alert.alert(
        'Error',
        error.response?.data?.message ?? error.message ?? 'Something went wrong'
      );
    }
  };

  return (
    // ⬅ NEW: SafeAreaView (edges: 'bottom' only — top is handled inside
    // AuthHeader/LanguageToggle already, so we don't want to double-pad top)
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={60}
      >
        <LanguageToggle />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AuthHeader />
          <LoginForm onLogin={handleLogin} />
        </ScrollView>

        <FooterLink CreateProfile={() => navigation.navigate('CreateProfile')} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F8F7',
  },

  flex: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
});