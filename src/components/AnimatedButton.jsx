import React, { useRef } from 'react';
import {
  TouchableWithoutFeedback,
  Animated,
  Text,
  StyleSheet,
  View,
} from 'react-native';

const AnimatedButton = ({
  title,
  onPress,
  width = '100%',
  height = 56,
  icon = null,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 80,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          styles.button,
          {
            width,
            height,
            transform: [{ scale: scaleAnim }],
          },
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

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FF6B00',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,

    elevation: 10,
  },

  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AnimatedButton;