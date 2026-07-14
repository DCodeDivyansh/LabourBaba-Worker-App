import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/theme';

const VerifyIdentityCard = () => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Verify Your Identity</Text>
      <Text style={styles.subtitle}>
        Join the network of trusted{'\n'}
        professionals.
      </Text>
    </View>
  );
};

export default VerifyIdentityCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xxl,
    margin: spacing.lg,

    shadowColor: colors.primaryDark,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },

  title: {
    color: colors.surface,
    fontSize: typography.h1.fontSize,
    fontWeight: typography.h1.fontWeight,
    marginBottom: spacing.sm,
  },

  subtitle: {
    color: colors.surface,
    fontSize: 17,
    lineHeight: 26,
    fontWeight: '400',
    opacity: 0.95,
  },
});
