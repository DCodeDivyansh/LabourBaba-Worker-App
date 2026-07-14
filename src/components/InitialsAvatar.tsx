import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/theme';

// ⬅ CHANGED: first swatch now matches the app's actual brand primary
// (colors.primary) instead of an old, slightly-off orange.
const AVATAR_COLORS = [
  colors.primary, '#2E7D32', '#007A99', '#6A4C93',
  '#C2410C', '#0F766E', '#B45309', '#4338CA',
];

const getInitials = (name?: string) => {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getColorForName = (name?: string) => {
  if (!name) return AVATAR_COLORS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

interface Props {
  name?: string;
  size?: number;
  borderColor?: string;
  fontSize?: number;
}

const InitialsAvatar = ({ name, size = 56, borderColor, fontSize }: Props) => {
  const initials = getInitials(name);
  const bgColor = getColorForName(name);
  const textSize = fontSize || Math.round(size * 0.38);

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bgColor,
          borderWidth: borderColor ? 2 : 0,
          borderColor: borderColor || 'transparent',
        },
      ]}
    >
      <Text style={[styles.text, { fontSize: textSize }]}>{initials}</Text>
    </View>
  );
};

export default InitialsAvatar;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});