import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import Logo from '../../assets/Logo.svg';
import Name from '../../assets/LogoName.svg';
import { useOnlineStatus } from '../api/OnlineStatusContext';
import { colors } from '../theme/theme';

const TopNav = () => {
  const { isOnline } = useOnlineStatus();
  const { t } = useTranslation();

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Logo width={36} height={36} />
          <Name width={120} height={50} style={styles.logoName} />
        </View>

        <View style={[styles.statusContainer, !isOnline && styles.statusContainerOffline]}>
          <View style={[styles.dot, !isOnline && styles.dotOffline]} />
          <Text style={[styles.statusText, !isOnline && styles.statusTextOffline]}>
            {isOnline ? t('dashboard.topNav.online') : t('dashboard.topNav.offline')}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TopNav;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  container: {
    height: 64,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
  },

  logoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  logoName: {
    marginLeft: 6,
  },

  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.success,
  },

  statusContainerOffline: {
    backgroundColor: '#F5F5F5',
    borderColor: '#9E9E9E',
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: 6,
  },

  dotOffline: {
    backgroundColor: '#9E9E9E',
  },

  statusText: {
    color: colors.success,
    fontSize: 14,
    fontWeight: '600',
  },

  statusTextOffline: {
    color: '#757575',
  },
});