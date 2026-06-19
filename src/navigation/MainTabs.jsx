import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import WorkerDashboardScreen from '../screens/jobs/WorkerDashboardScreen';
import JobsScreen from '../screens/jobs/JobsHistory';
import AlertsScreen from '../screens/jobs/AlertsScreen';
import ProfileScreen from '../screens/jobs/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={WorkerDashboardScreen}
      />

      <Tab.Screen
        name="Jobs"
        component={JobsScreen}
      />

      <Tab.Screen
        name="Alerts"
        component={AlertsScreen}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
}