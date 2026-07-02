import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TopAppBar from '../../components/TopAppBar';
import TickIcon from '../../../assets/TickIcon.svg'
import LocationIcon from '../../../assets/Location.svg'
import MoneyIcon from '../../../assets/MoneyIcon.svg'
import CalenderIcon from '../../../assets/CalenderIcon.svg'
import NavigateIcon from '../../../assets/Navigateicon.svg'
import CancelJobModal from './CancelJobModal';
import { useTranslation } from 'react-i18next';

const JobDetailsScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [showCancelModal, setShowCancelModal] =
    useState(false);
  return (
    <View style={styles.container}>
      {/* Header */}

      <TopAppBar title={t('jobs.jobDetails.screenTitle')} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 120,
        }}
      >
        {/* Status */}
        <View style={styles.statusRow}>
          <View style={styles.acceptedBadge}>
            <TickIcon />
            <Text style={styles.acceptedText}>
              {t('jobs.jobDetails.jobAccepted')}
            </Text>
          </View>

          <Text style={styles.jobId}>
            {t('jobs.jobDetails.jobIdLabel')}

          </Text>
        </View>

        {/* Customer Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileLeft}>
            <Image
              source={{
                uri: 'https://i.pravatar.cc/150?img=12',
              }}
              style={styles.avatar}
            />

            <View>
              <Text style={styles.name}>
                Rahul Sharma
              </Text>

              <View style={styles.ratingRow}>
                {/* <Ionicons
                  name="star"
                  size={14}
                  color="#FF5A00"
                /> */}
                <Text style={styles.ratingText}>
                  ⭐ 4.8 (24 {t('jobs.jobDetails.reviewsSuffix')}) • {t('jobs.jobDetails.serviceSeeker')}
                </Text>
              </View>
            </View>
          </View>

          {/* <TouchableOpacity style={styles.chatBtn}>
            <Ionicons
              name="chatbox-outline"
              size={22}
              color="#fff"
            />
          </TouchableOpacity> */}
        </View>

        {/* Schedule & Budget */}
        <View style={styles.infoRow}>
          <View style={styles.infoCard}>
            <View style={styles.cardLabel}>
              <CalenderIcon />
              <Text style={styles.cardLabelText}>
                {t('jobs.jobDetails.schedule')}
              </Text>
            </View>

            <Text style={styles.bigText}>
              Tomorrow
            </Text>

            <Text style={styles.smallText}>
              10:00 AM - 05:00 PM
            </Text>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.cardLabel}>
              <MoneyIcon />
              <Text style={styles.cardLabelText}>
                {t('jobs.jobDetails.budget')}
              </Text>
            </View>

            <Text style={styles.bigText}>
              ₹1,200
            </Text>

            <Text style={styles.smallText}>
              {t('jobs.jobDetails.cashOnCompletion')}
            </Text>
          </View>
        </View>

        {/* Location Card */}
        <View style={styles.locationCard}>
          <Image
            source={{
              uri: 'https://maps.googleapis.com/maps/api/staticmap?center=Mumbai&zoom=13&size=600x300',
            }}
            style={styles.map}
          />

          <View style={styles.addressSection}>
            <View style={styles.addressHeader}>
              <LocationIcon />

              <Text style={styles.addressTitle}>
                {t('jobs.jobDetails.serviceAddress')}
              </Text>
            </View>

            <Text style={styles.address}>
              Flat 402, Sunrise Apartments, SV Road,
              {'\n'}
              Bandra West, Mumbai 400050
            </Text>

            <TouchableOpacity
              style={styles.navigateBtn}
            >
              <NavigateIcon />

              <Text style={styles.navigateText}>
                {t('jobs.jobDetails.navigate')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.callBtn}>


          <Text style={styles.callText}>
            {t('jobs.jobDetails.callCustomer')}
          </Text>
        </TouchableOpacity>

        <View style={styles.bottomRow}>
          <TouchableOpacity
            onPress={() => {
              console.log('Cancel Pressed');
              setShowCancelModal(true);
            }}
          >
            <Text style={styles.cancelText}>
              {t('jobs.jobDetails.cancelJob')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.completedBtn}
          >
            <TickIcon />

            <Text style={styles.completedText}>
              {t('jobs.jobDetails.jobCompleted')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <CancelJobModal
        visible={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={reason => {
          console.log('Cancel Reason:', reason);

          setShowCancelModal(false);

          // API Call Here
        }}
      />
    </View>
  );
};

export default JobDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },

  header: {
    height: 90,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222',
  },

  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 18,
    marginBottom: 14,
  },

  acceptedBadge: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  acceptedText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: '600',
  },

  jobId: {
    color: '#666',
    fontWeight: '600',
  },

  profileCard: {
    marginHorizontal: 16,
    backgroundColor: '#FFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#FFD7C2',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 14,
  },

  name: {
    fontSize: 28,
    fontWeight: '700',
    color: '#222',
  },

  ratingRow: {
    flexDirection: 'row',
    marginTop: 5,
    alignItems: 'center',
  },

  ratingText: {
    marginLeft: 5,
    color: '#555',
    fontSize: 14,
  },

  chatBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FF5A00',
    justifyContent: 'center',
    alignItems: 'center',
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 20,
  },

  infoCard: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FFD7C2',
    padding: 16,
  },

  cardLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  cardLabelText: {
    marginLeft: 6,
    color: '#FF5A00',
    fontWeight: '700',
  },

  bigText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF5A00',
    marginTop: 20,
  },

  smallText: {
    color: '#FF5A00',
    marginTop: 10,
    lineHeight: 22,
  },

  locationCard: {
    margin: 16,
    backgroundColor: '#FFF',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#FFD7C2',
  },

  map: {
    width: '100%',
    height: 160,
  },

  addressSection: {
    padding: 16,
  },

  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  addressTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 8,
  },

  address: {
    marginTop: 12,
    fontSize: 18,
    color: '#555',
    lineHeight: 30,
  },

  navigateBtn: {
    height: 46,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FF5A00',
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  navigateText: {
    marginLeft: 8,
    color: '#FF5A00',
    fontWeight: '700',
    fontSize: 18,
  },

  bottomContainer: {
    backgroundColor: '#FFF',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#EEE',
  },

  callBtn: {
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF5A00',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  callText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '700',
    marginLeft: 8,
  },

  bottomRow: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  cancelText: {
    color: '#D32F2F',
    fontWeight: '700',
    fontSize: 16,
  },

  completedBtn: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
  },

  completedText: {
    marginLeft: 5,
    color: '#0B3D12',
    fontWeight: '700',
  },
});