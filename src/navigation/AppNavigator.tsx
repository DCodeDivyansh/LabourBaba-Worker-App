import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/auth/LoginScreen';
import OtpVerificationScreen from '../screens/auth/OtpVerificationScreen';
import CreateProfileScreen from '../screens/auth/CreateProfileScreen';
import Help from '../screens/profile/Help'
import LanguageSelectionScreen from '../screens/profile/LanguageSelectionScreen'
import PrivacyPolicy from '../screens/profile/PrivacyPolicy';
import JobDetailsScreen from '../screens/OtherPages/JobDetailsScreen';
import JobCompletedScreen from '../screens/OtherPages/JobCompletedScreen';
import IncomingJobScreen from '../screens/OtherPages/IncomingJobScreen';

import MainTabs from './MainTabs';

type Props = {
  initialRoute: string;
};


const Stack = createNativeStackNavigator();

export default function AppNavigator({
  initialRoute,
}: Props) {
  return (
      <Stack.Navigator
        initialRouteName={initialRoute}
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
          name="PrivacyPolicy"
          component={PrivacyPolicy}
        />
        <Stack.Screen
          name="JobDetails"
          component={JobDetailsScreen}
        />

        <Stack.Screen
          name="IncomingJobScreen"
          component={IncomingJobScreen}
          options={{
            headerShown: false,
            gestureEnabled: false,
            presentation: 'transparentModal',
            animation: 'fade',
            animationDuration: 160,
            contentStyle: { backgroundColor: 'transparent' },
          }}
        />

        <Stack.Screen
          name="JobCompleted"
          component={JobCompletedScreen}
          options={{
            gestureEnabled: false,
            animation: 'slide_from_bottom',
          }}
        />
      </Stack.Navigator>
  );
}