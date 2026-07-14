import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
} from 'react-native';

import LogoName from '../../../assets/LogoName.svg';
import { colors, spacing, typography } from '../../theme/theme';

// In-JS fallback shown for the brief window between the native BootSplash
// hiding and the navigator mounting (see App.tsx). Uses the same brand
// lockup as the rest of the app so there's no visual "flash" between the
// two splash states.
const SplashScreen = () => {
  const fade = useRef(new Animated.Value(0)).current;
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    const pulse = (value: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(value, { toValue: 1, duration: 450, delay, useNativeDriver: true }),
          Animated.timing(value, { toValue: 0.3, duration: 450, useNativeDriver: true }),
        ]),
      ).start();

    pulse(dot1, 0);
    pulse(dot2, 150);
    pulse(dot3, 300);
  }, [dot1, dot2, dot3, fade]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fade }]}>
        <Image
          source={require('../../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <LogoName width={176} height={24} style={styles.logoName} />

        <Text style={styles.tagline}>Find. Book. Build.</Text>

        <View style={styles.loader}>
          <Animated.View style={[styles.dot, { opacity: dot1 }]} />
          <Animated.View style={[styles.dot, { opacity: dot2 }]} />
          <Animated.View style={[styles.dot, { opacity: dot3 }]} />
        </View>
      </Animated.View>

      <Text style={styles.version}>Version 1.0.0</Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },

  content: {
    alignItems: 'center',
  },

  logo: {
    width: 108,
    height: 108,
  },

  logoName: {
    marginTop: spacing.lg,
  },

  tagline: {
    marginTop: spacing.sm,
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: colors.inkSoft,
    letterSpacing: 1,
  },

  loader: {
    flexDirection: 'row',
    marginTop: spacing.xxl,
    gap: 8,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },

  version: {
    position: 'absolute',
    bottom: 35,
    fontSize: typography.caption.fontSize,
    color: colors.inkSoft,
    letterSpacing: 2,
  },
});
