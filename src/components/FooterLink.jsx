import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FooterLink = ({ CreateProfile }) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: Math.max(insets.bottom, 14) + 10 },
      ]}
    >
      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.normalText}>New to LabourBaba?</Text>

        <TouchableOpacity
          onPress={CreateProfile}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          activeOpacity={0.7}
        >
          <Text style={styles.linkText}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FooterLink;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingTop: 16,
    paddingHorizontal: 24,
  },

  divider: {
    height: 1,
    backgroundColor: '#EFEAE6',
    marginBottom: 16,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },

  normalText: {
    fontSize: 15,
    color: '#8A7A72',
    fontWeight: '400',
  },

  linkText: {
    fontSize: 15,
    color: '#FF5A00',
    fontWeight: '700',
    marginLeft: 6,
  },
});