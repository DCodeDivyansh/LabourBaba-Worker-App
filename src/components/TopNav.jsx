import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import Logo from '../../assets/Logo.svg';
import Name from '../../assets/LogoName.svg';

const TopAppBar = () => {
  return (
    <SafeAreaView
      edges={['top']}
      style={styles.safeArea}
    >
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Logo
            width={36}
            height={36}
          />

          <Name
            width={120}
            height={50}
            style={styles.logoName}
          />
        </View>

        <View style={styles.statusContainer}>
          <View style={styles.dot} />

          <Text style={styles.statusText}>
            Online
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TopAppBar;



const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#FFFFFF',
  },

  container: {
    height: 64,

    paddingHorizontal: 16,

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#FFFFFF',

    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.08,
    // shadowRadius: 4,
    // elevation: 4,
  },

  logoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  logoName: {
    marginLeft: 6,
  },

  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#DFF7DF',

    paddingHorizontal: 12,
    paddingVertical: 6,

    borderRadius: 20,

    borderWidth: 1,
    borderColor: '#1B7D27',
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,

    backgroundColor: '#1B7D27',

    marginRight: 6,
  },

  statusText: {
    color: '#1B7D27',
    fontSize: 14,
    fontWeight: '600',
  },
});