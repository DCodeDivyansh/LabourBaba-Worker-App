import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/auth/LoginScreen';
import OtpVerificationScreen from '../screens/auth/OtpVerificationScreen';
import CreateProfileScreen from '../screens/auth/CreateProfileScreen';
import Help from '../screens/profile/Help'
import LanguageSelectionScreen from '../screens/profile/LanguageSelectionScreen'
import JobDetailsScreen from '../screens/OtherPages/JobDetailsScreen';
import CancelJobScreen from '../screens/OtherPages/CancelJobPage'

import MainTabs from './MainTabs';

const Stack = createNativeStackNavigator();

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
          name="MainTabs"
          component={MainTabs}
        />

        <Stack.Screen
          name="Help"
          component={Help}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Language"
          component={LanguageSelectionScreen}
        />
        <Stack.Screen
          name="JobDetails"
          component={JobDetailsScreen}
        />
        <Stack.Screen
          name="Cancel"
          component={CancelJobScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}