import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import HomeActive from '../../assets/HomeIcon.svg';
import Home from '../../assets/HomeIcon2.svg';
import JobsActive from '../../assets/JobIcon.svg';
import Jobs from '../../assets/JobIcon2.svg';
import AlertsActive from '../../assets/NotificationIcon.svg';
import Alerts from '../../assets/NotificationIcon2.svg';
import ProfileActive from '../../assets/ProfileIcon.svg';
import Profile from '../../assets/ProfileIcon2.svg';

import { colors, radius, shadow } from '../theme/theme';

// ⬅ FIXED: was `width * 0.055` — device-width scaling on icon size makes
// tab icons render at inconsistent sizes across phones/tablets instead of
// a predictable, deliberate size. Fixed dp values render consistently.
const ICON_SIZE = 22;

const BottomNav = ({ state, navigation }) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const tabs = [
    { key: 'navigation.home', icon: Home, activeIcon: HomeActive },
    { key: 'navigation.jobs', icon: Jobs, activeIcon: JobsActive },
    { key: 'navigation.alerts', icon: Alerts, activeIcon: AlertsActive, badge: true },
    { key: 'navigation.profile', icon: Profile, activeIcon: ProfileActive },
  ];

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {tabs.map((tab, index) => {
        const isActive = state.index === index;
        const Icon = isActive ? tab.activeIcon : tab.icon;
        const route = state.routes[index];

        return (
          <TouchableOpacity
            key={tab.key}
            activeOpacity={0.8}
            style={[styles.tab, isActive && styles.activeTab]}
            onPress={() => navigation.navigate(route.name)}
          >
            <View style={styles.iconContainer}>
              <Icon width={ICON_SIZE} height={ICON_SIZE} />
              {tab.badge && !isActive && <View style={styles.badge} />}
            </View>

            <Text style={[styles.label, isActive && styles.activeLabel]} numberOfLines={1}>
              {t(tab.key)}
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
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadow.nav,
  },

  tab: {
    flex: 1,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.xl,
  },

  activeTab: {
    backgroundColor: colors.primary,
  },

  iconContainer: {
    position: 'relative',
  },

  label: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '500',
    color: colors.inkSoft,
  },

  activeLabel: {
    color: colors.surface,
    fontWeight: '600',
  },

  badge: {
    position: 'absolute',
    top: -2,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
  },
});