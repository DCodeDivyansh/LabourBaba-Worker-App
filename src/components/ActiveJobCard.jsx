import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';

import LocationIcon from '../../assets/Location1.svg';
import MoneyIcon from '../../assets/Money.svg';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { getWorkerBookings } from '../services/booking';
import { getCurrentLocation } from '../services/location';

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

const ActiveJobCard = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [activeBooking, setActiveBooking] = useState(null);
  const [distance, setDistance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveJob = async () => {
      try {
        const response = await getWorkerBookings();
        const bookingsList = response?.data || [];
        // Find first booking that is confirmed, in_progress, or otp_pending
        const active = bookingsList.find(b => 
          b.status === 'confirmed' || 
          b.status === 'in_progress' || 
          b.status === 'otp_pending' || 
          b.status === 'OTP_PENDING' ||
          b.status === 'IN_PROGRESS'
        );
        setActiveBooking(active || null);

        if (active && active.job && active.job.latitude != null && active.job.longitude != null) {
          try {
            const here = await getCurrentLocation();
            const km = distanceKm(here.latitude, here.longitude, active.job.latitude, active.job.longitude);
            setDistance(km.toFixed(1));
          } catch (locErr) {
            console.log('[ActiveJobCard] Location error:', locErr?.message);
          }
        }
      } catch (err) {
        console.log('[ActiveJobCard] Fetch bookings error:', err?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveJob();
  }, []);

  const MoveToJobDetailsPage = () => {
    if (activeBooking) {
      navigation.navigate('JobDetails', { booking: activeBooking, bookingId: activeBooking.id });
    } else {
      navigation.navigate('JobDetails');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#FF6200" />
      </View>
    );
  }

  if (!activeBooking) {
    return null; // Don't show active job card if there is no active booking
  }

  const ratePerDay = activeBooking.job_requirement?.rate_per_day || activeBooking.job?.budget;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}> {t('dashboard.activeJob.sectionTitle')}</Text>

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
              {activeBooking.customer?.name || 'Customer'}
            </Text>

            <Text style={styles.rating}>
              ⭐ 4.8 ({t('jobs.jobDetails.reviewsSuffix', 'reviews')}) • {t('jobs.jobDetails.serviceSeeker', 'Customer')}
            </Text>
          </View>
        </View>

        {/* Location */}
        <View style={styles.infoRow}>
          <LocationIcon width={18} height={18}/>

          <Text style={styles.infoText}>
            {activeBooking.job?.location || 'Job Location'} {distance ? `(${distance}km away)` : ''}
          </Text>
        </View>

        {/* Price */}
        <View style={styles.infoRow}>
          <MoneyIcon width={18} height={18} />

          <Text style={styles.infoText}>
            ₹{ratePerDay || '—'} / Day
          </Text>
        </View>

        {/* Button */}
        <TouchableOpacity style={styles.button}
        onPress={MoveToJobDetailsPage}
        >
          <Text style={styles.buttonText}>
           {t('dashboard.activeJob.viewDetails')}
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

  loadingContainer: {
    marginHorizontal: 16,
    marginTop: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
    flex: 1,
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