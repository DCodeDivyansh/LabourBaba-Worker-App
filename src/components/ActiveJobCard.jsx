import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import LocationIcon from '../../assets/Location1.svg';
import MoneyIcon from '../../assets/Money.svg';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; // ⬅ CHANGED: added useFocusEffect
import { useTranslation } from 'react-i18next';
import { getWorkerBookings } from '../services/booking';
import { getCurrentLocation } from '../services/location';
import InitialsAvatar from './InitialsAvatar';
import { onJobCompleted } from '../services/events'; // ⬅ NEW

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

const STATUS_LABELS = {
  confirmed: 'Confirmed',
  CONFIRMED: 'Confirmed',
  in_progress: 'In Progress',
  IN_PROGRESS: 'In Progress',
  otp_pending: 'OTP Pending',
  OTP_PENDING: 'OTP Pending',
};

const ActiveJobCard = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [activeBooking, setActiveBooking] = useState(null);
  const [distance, setDistance] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchActiveJob = useCallback(async () => {
    try {
      const response = await getWorkerBookings();
      const bookingsList = response?.data || [];
      const active = bookingsList.find(b =>
        b.status === 'confirmed' ||
        b.status === 'IN_PROGRESS'
      );
      setActiveBooking(active || null);
      setDistance(null); // ⬅ NEW: reset stale distance when the active job changes

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
  }, []);

  // ⬅ CHANGED: was a one-time useEffect on mount — now refetches every time
  // this screen regains focus (e.g. returning from JobDetails after
  // completing a job), so the card reliably clears itself.
  useFocusEffect(
    useCallback(() => {
      fetchActiveJob();
    }, [fetchActiveJob])
  );

  // ⬅ NEW: instant update if a completion event fires while this card is
  // already mounted and focused (covers the case where the dashboard is
  // still on screen behind a modal, etc.)
  React.useEffect(() => {
    const unsubscribe = onJobCompleted(({ bookingId }) => {
      setActiveBooking((current) => {
        if (current && current.id === bookingId) {
          return null;
        }
        return current;
      });
    });
    return unsubscribe;
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
    return null;
  }

  const ratePerDay = activeBooking.job_requirement?.rate_per_day || activeBooking.job?.budget;
  const statusLabel = STATUS_LABELS[activeBooking.status] || activeBooking.status || 'Active';

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t('dashboard.activeJob.sectionTitle')}</Text>

      <View style={styles.card}>
        <View style={styles.statusRow}>
          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>{statusLabel}</Text>
          </View>
        </View>

        <View style={styles.header}>
          <InitialsAvatar name={activeBooking.customer?.name} size={56} />

          <View style={styles.userInfo}>
            <Text style={styles.name} numberOfLines={1}>
              {activeBooking.customer?.name || 'Customer'}
            </Text>
            <Text style={styles.rating}>
              ⭐ 4.8 • {t('jobs.jobDetails.serviceSeeker', 'Customer')}
            </Text>
          </View>
        </View>

        <View style={styles.hr} />

        <View style={styles.infoRow}>
          <View style={styles.iconBadge}>
            <LocationIcon width={16} height={16} />
          </View>
          <Text style={styles.infoText} numberOfLines={1}>
            {activeBooking.job?.location || 'Job Location'}
            {distance ? `  •  ${distance} km away` : ''}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.iconBadge}>
            <MoneyIcon width={16} height={16} />
          </View>
          <Text style={styles.infoText}>₹{ratePerDay || '—'} / Day</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={MoveToJobDetailsPage}
          activeOpacity={0.85}
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
  container: { marginHorizontal: 16, marginTop: 20 },
  loadingContainer: { marginHorizontal: 16, marginTop: 20, padding: 20, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { fontSize: 24, fontWeight: '700', color: '#1E1E1E', marginBottom: 14 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EDE7E2',
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statusRow: { flexDirection: 'row', marginBottom: 14 },
  statusPill: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF1E8',
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FF6200', marginRight: 6 },
  statusText: { color: '#FF6200', fontSize: 12, fontWeight: '700', letterSpacing: 0.3 },
  header: { flexDirection: 'row', alignItems: 'center' },
  userInfo: { marginLeft: 14, flex: 1 },
  name: { fontSize: 18, fontWeight: '700', color: '#1E1E1E' },
  rating: { fontSize: 13, color: '#8A7A72', marginTop: 2 },
  hr: { height: 1, backgroundColor: '#F0EBE7', marginVertical: 16 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  iconBadge: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#FF6200', justifyContent: 'center', alignItems: 'center' },
  infoText: { marginLeft: 10, fontSize: 15, color: '#3A3A3A', fontWeight: '500', flex: 1 },
  button: { backgroundColor: '#FF6200', height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});