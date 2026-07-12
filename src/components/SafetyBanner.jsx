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
          <Text
            style={styles.title}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {t('dashboard.safetyBanner.title')}
          </Text>

          <Text
            style={styles.subtitle}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {t('dashboard.safetyBanner.subtitle')}
          </Text>
        </View>
      </View>

      <View style={styles.arrowWrap}>
        <ArrowRightIcon width={18} height={18} />
      </View>
    </TouchableOpacity>
  );
};

export default SafetyBanner;

const styles = StyleSheet.create({
  container: {
    minHeight: 90, // ⬅ CHANGED: was fixed height:90, now grows if text wraps
    backgroundColor: '#ffffff',
    borderRadius: 16,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 18,
    paddingVertical: 14, // ⬅ NEW: breathing room when the card grows taller

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
    minWidth: 0, // ⬅ NEW: allows text children to shrink/wrap instead of overflowing
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DDE8FF',

    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0, // ⬅ NEW: icon never gets squeezed
  },

  textContainer: {
    marginLeft: 14,
    flex: 1,
    minWidth: 0, // ⬅ NEW: lets long text actually wrap instead of pushing the row wider than the screen
  },

  title: {
    fontSize: 20, // ⬅ CHANGED: 22 → 20, slightly safer at narrow widths
    fontWeight: '700',
    color: '#2D2D2D',
    flexShrink: 1, // ⬅ NEW
  },

  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#666666',
    flexShrink: 1, // ⬅ NEW
  },

  arrowWrap: {
    flexShrink: 0, // ⬅ NEW: arrow icon is never compressed by a long title
    marginLeft: 8,
  },
});