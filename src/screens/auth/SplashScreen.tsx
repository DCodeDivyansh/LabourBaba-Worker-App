import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
} from 'react-native';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.version}>Version 1.0.0</Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    justifyContent: 'center',
    alignItems: 'center',
  },

  leftShape: {
    position: 'absolute',
    left: -80,
    top: 0,
    width: 180,
    height: 350,
    backgroundColor: '#EED7C7',
    borderBottomRightRadius: 150,
  },

  rightShape: {
    position: 'absolute',
    right: -100,
    bottom: 0,
    width: 250,
    height: 350,
    backgroundColor: '#C8E8C8',
    borderTopLeftRadius: 200,
    opacity: 0.8,
  },

  content: {
    top: 400,
    alignItems: 'center',
  },

  logo: {
    width: 140,
    height: 140,
  },

  title: {
    marginTop: 10,
    fontSize: 42,
    fontWeight: '800',
    color: '#FF5B00',
  },

  tagline: {
    marginTop: 12,
    fontSize: 18,
    color: '#5A4A42',
    letterSpacing: 1,
  },

  loader: {
    flexDirection: 'row',
    marginTop: 60,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF5B00',
    marginHorizontal: 6,
  },

  version: {
    position: 'absolute',
    bottom: 35,
    fontSize: 14,
    color: '#7A6D66',
    letterSpacing: 2,
  },
});