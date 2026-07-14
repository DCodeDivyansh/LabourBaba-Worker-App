import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LocationIcon from '../../assets/Location.svg';
import { colors, radius, spacing, shadow } from '../theme/theme';

interface Props {
  location: string;
}

const LocationBanner = ({
  location,
}: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconBadge}>
        <LocationIcon width={16} height={16} />
      </View>

      <Text style={styles.text} numberOfLines={1}>
        Current location: <Text style={styles.value}>{location || 'Fetching location...'}</Text>
      </Text>
    </View>
  );
};

export default LocationBanner;

// ⬅ CHANGED: now matches the card styling used everywhere else on the
// dashboard (border, radius, subtle shadow) instead of a bare white box —
// keeps every card on this screen visually consistent.
const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadow.card,
  },

  iconBadge: {
    width: 30,
    height: 30,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },

  text: {
    marginLeft: spacing.md,
    fontSize: 14,
    fontWeight: '500',
    color: colors.inkSoft,
    flex: 1,
  },

  value: {
    color: colors.ink,
    fontWeight: '700',
  },
});
