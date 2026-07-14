import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import BackIcon from '../../assets/BackIcon.svg';
import { colors } from '../theme/theme';

const TopAppBar = ({ title, showBackButton = true }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top, height: 56 + insets.top }]}>
      {showBackButton ? (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <BackIcon width={22} height={22} />
        </TouchableOpacity>
      ) : (
        <View style={styles.spacer} />
      )}

      <Text numberOfLines={1} style={styles.title}>
        {title}
      </Text>

      <View style={styles.spacer} />
    </View>
  );
};

export default TopAppBar;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  spacer: {
    width: 40,
  },

  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    color: colors.ink, // ⬅ CHANGED: was brand orange — neutral title reads more professional
  },
});