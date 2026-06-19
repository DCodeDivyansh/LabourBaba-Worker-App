import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import TopAppBar from '../components/TopAppBar';
import Booking from '../../assets/booking.svg';
import DropDown from '../../assets/dropdown.svg';
import Payment from '../../assets/payment.svg';
import User from '../../assets/user.svg';
import Call from '../../assets/call.svg';
import Email from '../../assets/email.svg';

const Help = () => {
  return (
    <View style={styles.container}>
      <TopAppBar title="Help & Support" />

      <Text style={styles.title}>Frequently Asked Questions</Text>

      <View style={styles.box}>
        <View style={styles.leftSection}>
          <Booking width={24} height={24} />
          <Text style={styles.boxText}>Booking</Text>
        </View>

        <DropDown width={20} height={20} />
      </View>

      <View style={styles.box}>
        <View style={styles.leftSection}>
          <Payment width={24} height={24} />
          <Text style={styles.boxText}>Payments</Text>
        </View>

        <DropDown width={20} height={20} />
      </View>

      <View style={styles.box}>
        <View style={styles.leftSection}>
          <User width={24} height={24} />
          <Text style={styles.boxText}>Account</Text>
        </View>
        <DropDown width={20} height={20} />
      </View>
          <Text style={styles.title}>Need More Help?</Text>

          <View style={styles.box2}>
              <Call width={40} height={40} />

              <View style={styles.textContainer}>
                  <Text style={styles.callTitle}>Call Us</Text>
                  <Text style={styles.callSubtitle}>Available 24/7</Text>
              </View>
          </View>

          <View style={styles.box2}>
              <Email width={40} height={40} />

              <View style={styles.textContainer}>
                  <Text style={styles.callTitle}>Email Support</Text>
                  <Text style={styles.callSubtitle}>Respond within 24 hours</Text>
              </View>
          </View> 
    </View>
  );
};

export default Help;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  title: {
    color: '#000',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    marginLeft: 20,
    marginBottom: 10,
  },

  box: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 15,
    paddingHorizontal: 15,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    backgroundColor: '#FFF',
  },

  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  boxText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  box2: {
  flexDirection: 'row',
  alignItems: 'center',
  marginHorizontal: 20,
  marginTop: 15,
  padding: 15,
  borderWidth: 1,
  borderColor: '#E5E5E5',
  borderRadius: 12,
  backgroundColor: '#FFF',
},

textContainer: {
  marginLeft: 12,
},

callTitle: {
  fontSize: 16,
  fontWeight: '600',
  color: '#000',
},

callSubtitle: {
  fontSize: 14,
  color: '#666',
  marginTop: 4,
},
});