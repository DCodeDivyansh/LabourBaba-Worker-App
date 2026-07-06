import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Linking,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TopAppBar from '../../components/TopAppBar';
import TickIcon from '../../../assets/TickIcon.svg'
import LocationIcon from '../../../assets/Location.svg'
import MoneyIcon from '../../../assets/MoneyIcon.svg'
import CalenderIcon from '../../../assets/CalenderIcon.svg'
import NavigateIcon from '../../../assets/Navigateicon.svg'
import CancelJobModal from './CancelJobModal';
import { useTranslation } from 'react-i18next';
import { getBookingDetail, getWorkerBookings } from '../../services/booking';
import { getCurrentLocation } from '../../services/location';

// Haversine distance in km between two lat/lng points.
const distanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const JobDetailsScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const { bookingId, booking: initialBooking } = route.params || {};

  const [booking, setBooking] = useState(initialBooking || null);
  const [loading, setLoading] = useState(!initialBooking);
  const [distance, setDistance] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    const loadBookingData = async () => {
      try {
        let active = initialBooking;
        if (!active) {
          if (bookingId) {
            const detailRes = await getBookingDetail(bookingId);
            active = detailRes?.data;
          } else {
            const listRes = await getWorkerBookings();
            const bookingsList = listRes?.data || [];
            active = bookingsList.find(b => 
              b.status === 'confirmed' || 
              b.status === 'in_progress' || 
              b.status === 'otp_pending' || 
              b.status === 'OTP_PENDING' ||
              b.status === 'IN_PROGRESS'
            );
          }
        }
        setBooking(active || null);

        if (active && active.job && active.job.latitude != null && active.job.longitude != null) {
          try {
            const here = await getCurrentLocation();
            const km = distanceKm(here.latitude, here.longitude, active.job.latitude, active.job.longitude);
            setDistance(km.toFixed(1));
          } catch (locErr) {
            console.log('[JobDetailsScreen] Location error:', locErr?.message);
          }
        }
      } catch (err) {
        console.log('[JobDetailsScreen] Load data error:', err?.message);
      } finally {
        setLoading(false);
      }
    };

    loadBookingData();
  }, [bookingId, initialBooking]);

  const handleCall = () => {
    if (booking?.customer?.phone) {
      Linking.openURL(`tel:${booking.customer.phone}`);
    }
  };

  const handleNavigate = () => {
    if (booking?.job?.latitude != null && booking?.job?.longitude != null) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${booking.job.latitude},${booking.job.longitude}`;
      Linking.openURL(url);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#FF5A00" />
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={styles.container}>
        <TopAppBar title={t('jobs.jobDetails.screenTitle')} />
        <View style={styles.center}>
          <Text style={styles.noJobText}>No active job details found.</Text>
        </View>
      </View>
    );
  }

  const ratePerDay = booking.job_requirement?.rate_per_day || booking.job?.budget || '1,200';

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
            {t('jobs.jobDetails.jobIdLabel')} #{booking.id ? booking.id.substring(0, 8).toUpperCase() : 'LB-8492'}
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
                {booking.customer?.name || 'Customer'}
              </Text>

              <View style={styles.ratingRow}>
                <Text style={styles.ratingText}>
                  ⭐ 4.8 (24 {t('jobs.jobDetails.reviewsSuffix')}) • {t('jobs.jobDetails.serviceSeeker')}
                </Text>
              </View>
            </View>
          </View>
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
              ₹{ratePerDay}
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
              uri: booking.job?.latitude != null && booking.job?.longitude != null
                ? `https://maps.googleapis.com/maps/api/staticmap?center=${booking.job.latitude},${booking.job.longitude}&zoom=14&size=600x300&markers=color:red%7C${booking.job.latitude},${booking.job.longitude}`
                : 'https://maps.googleapis.com/maps/api/staticmap?center=Mumbai&zoom=13&size=600x300',
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
              {booking.job?.location || 'Job Location'}
            </Text>

            {distance && (
              <Text style={styles.distanceText}>
                📍 {distance} km away
              </Text>
            )}

            <TouchableOpacity
              style={styles.navigateBtn}
              onPress={handleNavigate}
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
        <TouchableOpacity style={styles.callBtn} onPress={handleCall}>
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

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  noJobText: {
    fontSize: 18,
    color: '#666',
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

  distanceText: {
    marginTop: 8,
    fontSize: 16,
    color: '#FF5A00',
    fontWeight: '700',
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