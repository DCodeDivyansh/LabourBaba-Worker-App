import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import Logo from '../../assets/Logo.svg';
import Name from '../../assets/LogoName.svg';


const TopAppBar = () => {
  return (
    <View style={styles.container}>
      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <Logo width={36} height={36} />

        <Name
          width={140}
          height={80}
          style={{ marginLeft: 6 }}
        />
      </View>

      {/* Online Status */}
      <View style={styles.statusContainer}>
        <View style={styles.dot} />
        <Text style={styles.statusText}>Online</Text>
      </View>
    </View>
  );
};

export default TopAppBar;

const styles = StyleSheet.create({
  container: {
    top: 0,
    paddingTop: 30,
    height: 94,
    backgroundColor: '#ffffff',

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 16,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,
  },

  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DFF7DF',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1B7D27',
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1B7D27',
    marginRight: 6,
  },

  statusText: {
    color: '#1B7D27',
    fontSize: 16,
    fontWeight: '600',
  },
});