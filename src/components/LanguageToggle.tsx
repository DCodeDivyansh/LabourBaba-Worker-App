import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const TOGGLE_WIDTH = width * 0.42; // 42% of screen width
const TOGGLE_HEIGHT = TOGGLE_WIDTH * 0.275;

const OPTION_WIDTH = TOGGLE_WIDTH / 2;
const ACTIVE_WIDTH = OPTION_WIDTH;
const ACTIVE_HEIGHT = TOGGLE_HEIGHT * 0.86;

const LanguageToggle = () => {
  const [selected, setSelected] = useState('English');

  const slideAnim = useRef(new Animated.Value(0)).current;

  const toggleLanguage = (lang:any) => {
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
              width: ACTIVE_WIDTH,
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
    marginTop: '10%',
  },

  toggleWrapper: {
    width: TOGGLE_WIDTH,
    height: TOGGLE_HEIGHT,
    borderRadius: TOGGLE_HEIGHT / 2,
    backgroundColor: '#EFE5DE',
    flexDirection: 'row',
    position: 'relative',
    overflow: 'hidden',
  },

  activeBackground: {
    position: 'absolute',
    backgroundColor: '#FF6200',
    top: '7%',
    left: 0,
  },

  option: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },

  text: {
    fontSize: width * 0.036,
    color: '#6D4C41',
    fontWeight: '500',
  },

  activeText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});