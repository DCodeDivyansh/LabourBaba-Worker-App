import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';

const LanguageToggle = () => {
  const [selected, setSelected] = useState('English');

  const slideAnim = useRef(new Animated.Value(0)).current;

  const toggleLanguage = (lang) => {
    setSelected(lang);

    Animated.timing(slideAnim, {
      toValue: lang === 'English' ? 0 : 1,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 80],
  });

  return (
    <View style={styles.container}>
      <View style={styles.toggleWrapper}>
        <Animated.View
          style={[
            styles.activeBackground,
            {
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
    marginTop: 40,
    top: 10,
  },

  toggleWrapper: {
    width: 160,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFE5DE',
    flexDirection: 'row',
    position: 'relative',
    overflow: 'hidden',
  },

  activeBackground: {
    position: 'absolute',
    width: 80,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FF6200',
    top: 3,
    left: 0,
  },

  option: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },

  text: {
    fontSize: 14,
    color: '#6D4C41',
    fontWeight: '500',
  },

  activeText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});