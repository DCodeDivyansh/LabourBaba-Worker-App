import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing, typography } from '../theme/theme';

// ⬅ CHANGED: was `width * X` scaling on every dimension below — that made
// the logo and text render at very different relative sizes on tablets vs.
// phones. Fixed dp values (matching the rest of the theme) render the same
// proportions everywhere.
const AuthHeader = () => {
  return (
    <SafeAreaView edges={['top']}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.brandName}>LabourBaba</Text>

          <Text style={styles.tagline}>Find · Book · Build</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AuthHeader;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: spacing.sm,
  },

  logoContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },

  logo: {
    width: 84,
    height: 84,
  },

  brandName: {
    fontSize: typography.h1.fontSize,
    fontWeight: typography.h1.fontWeight,
    color: colors.primary,
    marginTop: spacing.sm,
  },

  tagline: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: colors.inkSoft,
    marginTop: spacing.xs,
    letterSpacing: 0.4,
  },
});
