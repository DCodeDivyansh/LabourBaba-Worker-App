import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import HomeActive from '../../assets/HomeIcon.svg';
import Home from '../../assets/HomeIcon2.svg';

import JobsActive from '../../assets/JobIcon.svg';
import Jobs from '../../assets/JobIcon2.svg';

import AlertsActive from '../../assets/NotificationIcon.svg';
import Alerts from '../../assets/NotificationIcon2.svg';

import ProfileActive from '../../assets/ProfileIcon.svg';
import Profile from '../../assets/ProfileIcon2.svg';

const BottomNavBar = () => {
  const [activeTab, setActiveTab] = useState('Home');

  const tabs = [
    {
      name: 'Home',
      icon: Home,
      activeIcon: HomeActive,
    },
    {
      name: 'Jobs',
      icon: Jobs,
      activeIcon: JobsActive,
    },
    {
      name: 'Alerts',
      icon: Alerts,
      activeIcon: AlertsActive,
      badge: true,
    },
    {
      name: 'Profile',
      icon: Profile,
      activeIcon: ProfileActive,
    },
  ];

  return (
    <View style={styles.container}>
      {tabs.map(tab => {
        const isActive = activeTab === tab.name;

        const Icon = isActive
          ? tab.activeIcon
          : tab.icon;

        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => setActiveTab(tab.name)}
            style={[
              styles.tab,
              isActive && styles.activeTab,
            ]}
          >
            <View style={styles.iconContainer}>
              <Icon width={22} height={22} />

              {tab.badge && !isActive && (
                <View style={styles.badge} />
              )}
            </View>

            <Text
              style={[
                styles.label,
                isActive && styles.activeLabel,
              ]}
            >
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default BottomNavBar;

const styles = StyleSheet.create({
  container: {
    top: 100,
    height: 80,
    backgroundColor: '#ffffff',

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 16,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,
  },

  tab: {
    flex: 1,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 28,
  },

  activeTab: {
    backgroundColor: '#FF6200',
    flexDirection: 'Column',
    paddingHorizontal: 16,
  },

  iconContainer: {
    position: 'relative',
  },

  label: {
    marginTop: 4,
    fontSize: 13,
    color: '#6B4E3D',
    fontWeight: '500',
  },

  activeLabel: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  badge: {
    position: 'absolute',
    top: -2,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C62828',
  },
});