import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import BackIcon from '../../assets/BackIcon.svg';

const TopAppBar = ({
  title,
  showBackButton = true,
}) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          height: 60 + insets.top,
        },
      ]}
    >
      {showBackButton ? (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <BackIcon width={24} height={24} />
        </TouchableOpacity>
      ) : (
        <View style={styles.spacer} />
      )}

      <Text
        numberOfLines={1}
        style={styles.title}
      >
        {title}
      </Text>

      <View style={styles.spacer} />
    </View>
  );
};

export default TopAppBar;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 16,

    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',

    elevation: 3,
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

    fontSize: 24,
    fontWeight: '700',

    color: '#FF5A00',
  },
});