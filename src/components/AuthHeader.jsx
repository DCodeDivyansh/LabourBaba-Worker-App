import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const AuthHeader = () => {
  return (
    <SafeAreaView edges={['top']}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.brandName}>
            LabourBaba
          </Text>

          <Text style={styles.tagline}>
            Find Book Build
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AuthHeader;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 10,
  },

  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },

  logo: {
    width: width * 0.55,
    height: width * 0.20,
  },

  brandName: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FF6200',
    marginTop: 8,
  },

  tagline: {
    fontSize: 18,
    color: '#6D4C41',
    marginTop: 4,
  },
});