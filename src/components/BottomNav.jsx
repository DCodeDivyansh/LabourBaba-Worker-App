import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import HomeActive from '../../assets/HomeIcon.svg';
import Home from '../../assets/HomeIcon2.svg';

import JobsActive from '../../assets/JobIcon.svg';
import Jobs from '../../assets/JobIcon2.svg';

import AlertsActive from '../../assets/NotificationIcon.svg';
import Alerts from '../../assets/NotificationIcon2.svg';

import ProfileActive from '../../assets/ProfileIcon.svg';
import Profile from '../../assets/ProfileIcon2.svg';

const BottomNav = ({
  state,
  navigation,
}) => {
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
      {tabs.map((tab, index) => {
        const isActive =
          state.index === index;

        const Icon = isActive
          ? tab.activeIcon
          : tab.icon;

        const route =
          state.routes[index];

        return (
          <TouchableOpacity
            key={tab.name}
            activeOpacity={0.8}
            style={[
              styles.tab,
              isActive &&
                styles.activeTab,
            ]}
            onPress={() => {
              navigation.navigate(
                route.name,
              );
            }}
          >
            <View
              style={styles.iconContainer}
            >
              <Icon
                width={22}
                height={22}
              />

              {tab.badge &&
                !isActive && (
                  <View
                    style={styles.badge}
                  />
                )}
            </View>

            <Text
              style={[
                styles.label,
                isActive &&
                  styles.activeLabel,
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

export default BottomNav;

const styles = StyleSheet.create({
  container: {
    height: 80,
    backgroundColor: '#FFFFFF',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 16,

    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',

    elevation: 10,
  },

  tab: {
    flex: 1,
    height: 54,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 28,
  },

  activeTab: {
    backgroundColor: '#FF6200',
  },

  iconContainer: {
    position: 'relative',
  },

  label: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '500',
    color: '#6B4E3D',
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