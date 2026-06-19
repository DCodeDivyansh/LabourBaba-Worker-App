import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import LocationIcon from '../../assets/Location.svg'

const LocationBanner = ({
  location = 'Andheri East, Mumbai',
}) => {
  return (
    <View style={styles.container}>
        <LocationIcon />

      <Text style={styles.text}>
        Current Location: {location}
      </Text>
    </View>
  );
};

export default LocationBanner;

const styles = StyleSheet.create({
  container: {
    margin:15,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding:10,
    // paddingVertical: 12,
    // paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  icon: {
    fontSize: 18,
    marginRight: 8,
  },

  text: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#6D4C41',
    flex: 1,
  },
});