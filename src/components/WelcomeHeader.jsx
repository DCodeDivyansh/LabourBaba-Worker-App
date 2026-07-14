import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import InitialsAvatar from './InitialsAvatar';
import { colors, spacing, typography } from '../theme/theme';

const WelcomeHeader = ({ name }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.textWrap}>
        <Text style={styles.greeting} numberOfLines={2}>
          {t('dashboard.welcome.greeting', {
            name: name || t('dashboard.welcome.defaultName'),
          })}
        </Text>
        <Text style={styles.subtitle}>{t('dashboard.welcome.subtitle')}</Text>
      </View>

      <InitialsAvatar name={name} size={52} borderColor={colors.surface} />
    </View>
  );
};

export default WelcomeHeader;

// ⬅ CHANGED: was `width: '90%', marginLeft: '5%'` — an unusual way to center
// a full-width row that also fights with the ScrollView's own padding.
// Consistent horizontal padding lines this row up with every other card on
// the dashboard (AvailabilityCard, ActiveJobCard, etc. all use 16dp).
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  textWrap: {
    flex: 1,
    marginRight: spacing.md,
  },

  greeting: {
    fontSize: typography.h1.fontSize,
    fontWeight: typography.h1.fontWeight,
    color: colors.ink,
    lineHeight: 34,
  },

  subtitle: {
    marginTop: spacing.xs,
    fontSize: typography.body.fontSize,
    color: colors.inkSoft,
    fontWeight: '500',
  },
});
