import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

const AuthHeader = () => {
  return (
    <SafeAreaView>
      <View style={styles.container}>

        {/* Logo Section */}
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
    paddingTop: 30,
  },

  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
  },

  logo: {
    width: 220,
    height: 80,
  },

  brandName: {
    fontSize: 38,
    fontWeight: '700',
    color: '#FF6200',
    marginTop: 8,
  },

  tagline: {
    fontSize: 22,
    color: '#6D4C41',
    marginTop: 4,
  },
});