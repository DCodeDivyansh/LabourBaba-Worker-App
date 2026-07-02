import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import { useTranslation } from 'react-i18next';

import ShieldIcon from '../../assets/Shield.svg';
import ArrowRightIcon from '../../assets/ArrowRight.svg';

const SafetyBanner = () => {
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.container}
    >
      <View style={styles.leftSection}>
        <View style={styles.iconContainer}>
          <ShieldIcon width={26} height={26} />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>
            {t('dashboard.safetyBanner.title')}
          </Text>

          <Text style={styles.subtitle}>
            {t('dashboard.safetyBanner.subtitle')}
          </Text>
        </View>
      </View>

      <ArrowRightIcon width={18} height={18} />
    </TouchableOpacity>
  );
};

export default SafetyBanner;

const styles = StyleSheet.create({
  container: {
    height: 90,
    backgroundColor: '#ffffff',
    borderRadius: 16,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 18,

    marginHorizontal: 16,
    marginVertical: 10,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },

  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DDE8FF',

    justifyContent: 'center',
    alignItems: 'center',
  },

  textContainer: {
    marginLeft: 14,
    flex: 1,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2D2D2D',
  },

  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#666666',
  },
});