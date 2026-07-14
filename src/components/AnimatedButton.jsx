import React, { useRef } from 'react';
import { TouchableWithoutFeedback, Animated, Text, StyleSheet, View } from 'react-native';
import { colors, radius } from '../theme/theme';

const AnimatedButton = ({ title, onPress, width = '100%', height = 56, icon = null, disabled = false }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled) return;
    Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    Animated.spring(scaleAnim, { toValue: 1, friction: 4, tension: 80, useNativeDriver: true }).start();
  };

  return (
    <TouchableWithoutFeedback
      onPress={disabled ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          styles.button,
          { width, height, transform: [{ scale: scaleAnim }] },
          disabled && styles.buttonDisabled,
        ]}
      >
        <View style={styles.content}>
          <Text style={styles.text}>{title}</Text>
          {icon}
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default AnimatedButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    // ⬅ REMOVED: marginBottom: 100 — a shared button should never dictate
    // page layout spacing; that hardcoded value forced 100px of unwanted
    // space onto every screen using this component. Spacing belongs to
    // the screen/container, not the button itself.
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  text: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
});