import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

import LocationIcon from '../../assets/Location1.svg';
import MoneyIcon from '../../assets/Money.svg';
import { useNavigation } from '@react-navigation/native';

const ActiveJobCard = () => {
  const navigation = useNavigation();
  const MoveToJobDetailsPage =()=>{
      navigation.navigate('JobDetails');
  }
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Up Next</Text>

      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={{
              uri: 'https://randomuser.me/api/portraits/men/32.jpg',
            }}
            style={styles.avatar}
          />

          <View style={styles.userInfo}>
            <Text style={styles.name}>
              Rahul Sharma
            </Text>

            <Text style={styles.rating}>
              4.8 (120+ jobs)
            </Text>
          </View>
        </View>

        {/* Location */}
        <View style={styles.infoRow}>
          <LocationIcon width={18} height={18}/>

          <Text style={styles.infoText}>
            Worli, Mumbai (4.2km away)
          </Text>
        </View>

        {/* Price */}
        <View style={styles.infoRow}>
          <MoneyIcon width={18} height={18} />

          <Text style={styles.infoText}>
            ₹850 / Day
          </Text>
        </View>

        {/* Button */}
        <TouchableOpacity style={styles.button}
        onPress={MoveToJobDetailsPage}
        >
          <Text style={styles.buttonText}>
            View Details
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ActiveJobCard;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 20,
  },

  sectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#222',
    marginBottom: 14,
  },

  card: {
    backgroundColor: '#FF6200',
    borderRadius: 18,
    padding: 18,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  userInfo: {
    marginLeft: 12,
  },

  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },

  rating: {
    fontSize: 14,
    color: '#ffffff',
    marginTop: 2,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  infoText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },

  button: {
    backgroundColor: '#F2F2F2',
    height: 46,
    borderRadius: 23,

    justifyContent: 'center',
    alignItems: 'center',

    marginTop: 16,
  },

  buttonText: {
    color: '#FF6200',
    fontSize: 16,
    fontWeight: '700',
  },
});