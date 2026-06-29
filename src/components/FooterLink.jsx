import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const FooterLink = ({ CreateProfile }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.normalText}>
        New to LabourBaba?
      </Text>

      <TouchableOpacity onPress={CreateProfile}>
        <Text style={styles.linkText}>
          Create Account
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default FooterLink;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
    paddingTop: 10,
  },

  normalText: {
    fontSize: 16,
    color: '#5A463F',
    fontWeight: '400',
  },

  linkText: {
    fontSize: 16,
    color: '#FF5A00',
    fontWeight: '700',
    marginLeft: 4,
  },
});