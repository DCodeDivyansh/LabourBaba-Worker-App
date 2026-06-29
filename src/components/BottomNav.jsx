import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeActive from '../../assets/HomeIcon.svg';
import Home from '../../assets/HomeIcon2.svg';

import JobsActive from '../../assets/JobIcon.svg';
import Jobs from '../../assets/JobIcon2.svg';

import AlertsActive from '../../assets/NotificationIcon.svg';
import Alerts from '../../assets/NotificationIcon2.svg';

import ProfileActive from '../../assets/ProfileIcon.svg';
import Profile from '../../assets/ProfileIcon2.svg';

const { width } = Dimensions.get('window');

const BottomNav = ({ state, navigation }) => {
  const insets = useSafeAreaInsets();

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
    <View
      style={[
        styles.container,
        {
          paddingBottom: Math.max(
            insets.bottom,
            10
          ),
        },
      ]}
    >
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
            onPress={() =>
              navigation.navigate(
                route.name,
              )
            }
          >
            <View
              style={styles.iconContainer}
            >
              <Icon
                width={width * 0.055}
                height={width * 0.055}
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
    backgroundColor: '#FFFFFF',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: width * 0.04,
    paddingTop: 10,

    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',

    elevation: 12,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
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
    fontSize: width * 0.03,
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