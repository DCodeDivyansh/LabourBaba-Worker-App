import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';

import { colors, spacing } from '../theme/theme';

// ⬅ CHANGED: fixed dp values instead of `Dimensions.get('window').width`
// scaling — keeps the pill a consistent, deliberate size on phones and
// tablets alike instead of stretching with screen width.
const TOGGLE_WIDTH = 160;
const TOGGLE_HEIGHT = 44;
const OPTION_WIDTH = TOGGLE_WIDTH / 2;
const ACTIVE_HEIGHT = TOGGLE_HEIGHT - 6;

const LanguageToggle = () => {
  const [selected, setSelected] = useState('English');

  const slideAnim = useRef(new Animated.Value(0)).current;

  const toggleLanguage = (lang: string) => {
    setSelected(lang);

    Animated.timing(slideAnim, {
      toValue: lang === 'English' ? 0 : 1,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, OPTION_WIDTH],
  });

  return (
    <View style={styles.container}>
      <View style={styles.toggleWrapper}>
        <Animated.View
          style={[
            styles.activeBackground,
            {
              width: OPTION_WIDTH,
              height: ACTIVE_HEIGHT,
              borderRadius: ACTIVE_HEIGHT / 2,
              transform: [{ translateX }],
            },
          ]}
        />

        <TouchableOpacity
          style={styles.option}
          onPress={() => toggleLanguage('English')}
        >
          <Text
            style={[
              styles.text,
              selected === 'English' && styles.activeText,
            ]}
          >
            English
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => toggleLanguage('Hindi')}
        >
          <Text
            style={[
              styles.text,
              selected === 'Hindi' && styles.activeText,
            ]}
          >
            हिंदी
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LanguageToggle;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },

  toggleWrapper: {
    width: TOGGLE_WIDTH,
    height: TOGGLE_HEIGHT,
    borderRadius: TOGGLE_HEIGHT / 2,
    backgroundColor: colors.primaryLight,
    flexDirection: 'row',
    position: 'relative',
    overflow: 'hidden',
    padding: 3,
  },

  activeBackground: {
    position: 'absolute',
    backgroundColor: colors.primary,
    top: 3,
    left: 3,
  },

  option: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },

  text: {
    fontSize: 14,
    color: colors.inkSoft,
    fontWeight: '600',
  },

  activeText: {
    color: colors.surface,
    fontWeight: '700',
  },
});
