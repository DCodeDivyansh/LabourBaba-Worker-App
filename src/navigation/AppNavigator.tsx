import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/auth/LoginScreen';
import OtpVerificationScreen from '../screens/auth/OtpVerificationScreen';
import CreateProfileScreen from '../screens/auth/CreateProfileScreen';
import WorkerDashboardScreen from '../screens/jobs/WorkerDashboardScreen';

export type RootStackParamList = {
  Login: undefined;
  OtpVerification: undefined;
  CreateProfile: undefined;
  Dashboard: undefined;
};

const Stack =
  createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />

        <Stack.Screen
          name="OtpVerification"
          component={OtpVerificationScreen}
        />

        <Stack.Screen
          name="CreateProfile"
          component={CreateProfileScreen}
        />

        <Stack.Screen
          name="Dashboard"
          component={WorkerDashboardScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}