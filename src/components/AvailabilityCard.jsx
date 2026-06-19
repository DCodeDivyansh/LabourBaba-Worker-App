import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import AvailabilityIcon from '../../assets/Avaliable.svg';

const AvailabilityCard = () => {
  const [available, setAvailable] = useState(true);

  return (
    <View style={styles.card}>
      <View style={styles.leftContainer}>
        <AvailabilityIcon width={28} height={28} />

        <View style={styles.textContainer}>
          <Text style={styles.title}>
            Available Now
          </Text>

          <Text style={styles.subtitle}>
            You are visible to nearby
            {'\n'}
            customers
          </Text>
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.toggle}
        onPress={() => setAvailable(!available)}
      >
        <View
          style={[
            styles.thumb,
            available && styles.thumbRight,
          ]}
        />
      </TouchableOpacity>
    </View>
  );
};

export default AvailabilityCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FF6200',
    borderRadius: 16,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 18,
    paddingVertical: 18,

    marginHorizontal: 16,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
  },

  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  textContainer: {
    marginLeft: 12,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },

  subtitle: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 4,
    lineHeight: 18,
  },

  toggle: {
    width: 52,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },

  thumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FF6200',
  },

  thumbRight: {
    alignSelf: 'flex-end',
  },
});