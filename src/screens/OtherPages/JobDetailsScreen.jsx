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
  Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import TopAppBar from '../../components/TopAppBar';
import TickIcon from '../../../assets/TickIcon.svg';
import LocationIcon from '../../../assets/Location.svg';
import MoneyIcon from '../../../assets/MoneyIcon.svg';
import CalenderIcon from '../../../assets/CalenderIcon.svg';
import NavigateIcon from '../../../assets/Navigateicon.svg';
import CancelJobModal from './CancelJobModal';
import { useTranslation } from 'react-i18next';
import { getCurrentLocation } from '../../services/location';
import { getBookingDetail, getWorkerBookings, completeBooking, verifyOtp, cancelBooking } from '../../services/booking'; // ⬅ CHANGED
import { emitJobCompleted, emitJobCancelled } from '../../services/events'; // ⬅ CHANGED
import OtpVerifyModal from '../../components/OtpVerifyModal'; // ⬅ NEW

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

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const formatTime = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('');
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
  const [completing, setCompleting] = useState(false);

  const [showOtpModal, setShowOtpModal] = useState(false); // ⬅ NEW
  const [verifyingOtp, setVerifyingOtp] = useState(false); // ⬅ NEW
  const [cancelling, setCancelling] = useState(false); // ⬅ NEW

  useEffect(() => {
    const loadBookingData = async () => {
      try {
        let active = initialBooking;
        // Unwrap nested booking if it is wrapped in response data
        if (active && active.booking) {
          active = active.booking;
        }

        const needsFetch = !active || !active.customer || !active.job;
        if (needsFetch) {
          setLoading(true);
          if (bookingId || active?.id) {
            const idToFetch = bookingId || active.id;
            const detailRes = await getBookingDetail(idToFetch);
            active = detailRes?.data;
          } else {
            const listRes = await getWorkerBookings();
            const bookingsList = listRes?.data || [];
            active = bookingsList.find(
              (b) =>
                b.status === 'confirmed' ||
                b.status === 'in_progress' ||
                b.status === 'otp_pending' ||
                b.status === 'OTP_PENDING' ||
                b.status === 'IN_PROGRESS',
            );
          }
        }
        setBooking(active || null);

        if (active && active.job && active.job.latitude != null && active.job.longitude != null) {
          try {
            const here = await getCurrentLocation();
            const km = distanceKm(
              here.latitude,
              here.longitude,
              active.job.latitude,
              active.job.longitude,
            );
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
    const phone = booking?.customer?.phone;
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    } else {
      Alert.alert('No Contact', 'Customer phone number is not available.');
    }
  };

  const handleNavigate = () => {
    if (booking?.job?.latitude != null && booking?.job?.longitude != null) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${booking.job.latitude},${booking.job.longitude}`;
      Linking.openURL(url);
    } else if (booking?.job?.location) {
      const encoded = encodeURIComponent(booking.job.location);
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encoded}`);
    }
  };

  // ⬅ NEW: OTP must succeed before completeBooking can ever succeed server-side
  const handleOtpSubmit = async (otp) => {
    if (verifyingOtp || !booking?.id) return;
    setVerifyingOtp(true);
    try {
      const response = await verifyOtp(booking.id, otp);
      if (response?.success === false) {
        throw new Error(response?.message || 'Invalid OTP');
      }
      setBooking((prev) => (prev ? { ...prev, status: 'IN_PROGRESS' } : prev));
      setShowOtpModal(false);
    } catch (err) {
      console.log('[JobDetailsScreen] OTP verify error:', err?.message);
      Alert.alert('Invalid OTP', err?.message || 'That code did not match. Please try again.');
    } finally {
      setVerifyingOtp(false);
    }
  };

  // ⬅ NEW: was console.log stub — now actually calls the backend
  const handleCancelConfirm = async (reasonId) => {
    if (cancelling || !booking?.id) return;
    const reasonText = t(`jobs.cancelModal.reasons.${reasonId}`, reasonId);
    setCancelling(true);
    try {
      const response = await cancelBooking(booking.id, reasonText);
      if (response?.success === false) {
        throw new Error(response?.message || 'Failed to cancel job');
      }
      emitJobCancelled(booking.id);
      setShowCancelModal(false);
      setCancelling(false);
      if (navigation.canGoBack()) navigation.goBack();
    } catch (err) {
      console.log('[JobDetailsScreen] Cancel booking error:', err?.message);
      setCancelling(false);
      Alert.alert('Something Went Wrong', "We couldn't cancel this job. Please check your connection and try again.");
    }
  };

  const handleComplete = async () => {
    if (completing) return;
    Alert.alert(
      t('jobs.jobDetails.jobCompleted'),
      'Are you sure you want to mark this job as completed?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Complete',
          onPress: async () => {
            setCompleting(true);
            try {
              if (!booking?.id) {
                throw new Error('Missing booking id');
              }

              const response = await completeBooking(booking.id);

              // ⬅ FIXED: only treat this as success if the backend actually
              // confirms it. Previously any error was caught, logged, and the
              // screen still navigated to JobCompleted as if it worked.
              if (response?.success === false) {
                throw new Error(response?.message || 'Failed to complete job');
              }

              // ⬅ NEW: broadcast so any mounted screen (dashboard, jobs list,
              // profile stats) can update immediately without waiting for a
              // manual refresh or screen focus.
              emitJobCompleted(booking.id);

              setCompleting(false);
              navigation.navigate('JobCompleted', { booking });
            } catch (err) {
              console.log('[JobDetailsScreen] Complete booking error:', err?.message);
              setCompleting(false);
              Alert.alert(
                'Something Went Wrong',
                "We couldn't mark this job as completed. Please check your connection and try again."
              );
            }
          },
        },
      ],
    );
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
          <Text style={styles.noJobText}>No job details found.</Text>
        </View>
      </View>
    );
  }

  // ── Real data extraction ──────────────────────────────────────────────────
  const customerName = booking.customer?.name || 'Customer';
  const customerPhone = booking.customer?.phone || null;
  const customerInitials = getInitials(customerName);
  const customerAvatar = booking.customer?.avatar || booking.customer?.photo || null;

  const ratePerDay =
    booking.job_requirement?.rate_per_day || booking.job?.budget || '—';
  const skillType =
    booking.job_requirement?.skill_type || booking.job?.skill_type || '—';
  const scheduledDate = booking.scheduled_at || booking.created_at;

  // ⬅ FIXED: real backend statuses are 'confirmed' (lowercase, pre-OTP),
  // 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'. There is no 'done'/'otp_pending'.
  const statusLower = booking.status?.toLowerCase() || '';
  const isCompleted = statusLower === 'completed';
  const isInProgress = statusLower === 'in_progress';
  const needsOtp = !isCompleted && !isInProgress;

  return (
    <View style={styles.container}>
      <TopAppBar title={t('jobs.jobDetails.screenTitle')} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 130 }}
      >
        {/* ── Status row ─────────────────────────────────────────────────── */}
        <View style={styles.statusRow}>
          <View style={[styles.statusBadge, isCompleted && styles.statusBadgeCompleted]}>
            <TickIcon />
            <Text style={styles.statusBadgeText}>
              {isCompleted
                ? t('jobs.jobCompleted.screenTitle', 'Completed')
                : t('jobs.jobDetails.jobAccepted', 'Job Accepted')}
            </Text>
          </View>
          <Text style={styles.jobId}>
            #{booking.id ? booking.id.substring(0, 8).toUpperCase() : 'LB-0000'}
          </Text>
        </View>

        {/* ── Customer card ───────────────────────────────────────────────── */}
        <View style={styles.profileCard}>
          <View style={styles.profileLeft}>
            {customerAvatar ? (
              <Image source={{ uri: customerAvatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarInitials}>{customerInitials}</Text>
              </View>
            )}

            <View>
              <Text style={styles.name}>{customerName}</Text>

              {customerPhone ? (
                <Text style={styles.phone}>📞 {customerPhone}</Text>
              ) : null}

              <View style={styles.ratingRow}>
                <Text style={styles.ratingText}>
                  ⭐ 4.8 • {t('jobs.jobDetails.serviceSeeker', 'Service Seeker')}
                </Text>
              </View>
            </View>
          </View>

          {/* Quick call button */}
          {customerPhone ? (
            <TouchableOpacity style={styles.quickCallBtn} onPress={handleCall}>
              <Text style={styles.quickCallText}>📞</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* ── Skill badge ─────────────────────────────────────────────────── */}
        <View style={styles.skillRow}>
          <View style={styles.skillBadge}>
            <Text style={styles.skillText}>🔧 {skillType}</Text>
          </View>
          <View style={styles.paymentBadge}>
            <Text style={styles.paymentText}>💵 Cash on Completion</Text>
          </View>
        </View>

        {/* ── Schedule & Budget ───────────────────────────────────────────── */}
        <View style={styles.infoRow}>
          <View style={styles.infoCard}>
            <View style={styles.cardLabel}>
              <CalenderIcon />
              <Text style={styles.cardLabelText}>{t('jobs.jobDetails.schedule', 'SCHEDULE')}</Text>
            </View>
            <Text style={styles.bigText}>{formatDate(scheduledDate)}</Text>
            <Text style={styles.smallText}>{formatTime(scheduledDate)}</Text>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.cardLabel}>
              <MoneyIcon />
              <Text style={styles.cardLabelText}>{t('jobs.jobDetails.budget', 'BUDGET')}</Text>
            </View>
            <Text style={styles.bigText}>₹{ratePerDay}</Text>
            <Text style={styles.smallText}>{t('jobs.jobDetails.cashOnCompletion', 'Cash on Completion')}</Text>
          </View>
        </View>

        {/* ── Location card ───────────────────────────────────────────────── */}
        <View style={styles.locationCard}>
          {booking.job?.latitude != null && booking.job?.longitude != null ? (
            <Image
              source={{
                uri: `https://maps.googleapis.com/maps/api/staticmap?center=${booking.job.latitude},${booking.job.longitude}&zoom=14&size=600x300&markers=color:red%7C${booking.job.latitude},${booking.job.longitude}`,
              }}
              style={styles.map}
            />
          ) : (
            <View style={styles.mapPlaceholder}>
              <Text style={styles.mapPlaceholderText}>📍 Map not available</Text>
            </View>
          )}

          <View style={styles.addressSection}>
            <View style={styles.addressHeader}>
              <LocationIcon />
              <Text style={styles.addressTitle}>{t('jobs.jobDetails.serviceAddress', 'Service Address')}</Text>
            </View>

            <Text style={styles.address}>{booking.job?.location || 'Job Location'}</Text>

            {distance && (
              <Text style={styles.distanceText}>📍 {distance} km away</Text>
            )}

            <TouchableOpacity style={styles.navigateBtn} onPress={handleNavigate}>
              <NavigateIcon />
              <Text style={styles.navigateText}>{t('jobs.jobDetails.navigate', 'Navigate')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Job description ─────────────────────────────────────────────── */}
        {booking.job?.description ? (
          <View style={styles.descCard}>
            <Text style={styles.descTitle}>📝 Job Description</Text>
            <Text style={styles.descText}>{booking.job.description}</Text>
          </View>
        ) : null}
      </ScrollView>

      {/* ── Bottom Actions ───────────────────────────────────────────────── */}
      {!isCompleted && (
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.callBtn} onPress={handleCall}>
            <Text style={styles.callText}>📞 {t('jobs.jobDetails.callCustomer', 'Call Customer')}</Text>
          </TouchableOpacity>

          <View style={styles.bottomRow}>
            <TouchableOpacity
              onPress={() => setShowCancelModal(true)}
            >
              <Text style={styles.cancelText}>{t('jobs.jobDetails.cancelJob', 'Cancel Job')}</Text>
            </TouchableOpacity>

            {needsOtp ? (
              // ⬅ NEW: gate — a booking must reach IN_PROGRESS via OTP before
              // completeBooking can succeed (enforced server-side in bookingServices).
              <TouchableOpacity style={styles.completedBtn} onPress={() => setShowOtpModal(true)}>
                <Text style={styles.completedText}>🔑 Verify OTP to Start</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.completedBtn} onPress={handleComplete} disabled={completing}>
                {completing ? (
                  <ActivityIndicator size="small" color="#0B3D12" />
                ) : (
                  <>
                    <TickIcon />
                    <Text style={styles.completedText}>{t('jobs.jobDetails.jobCompleted', 'Job Completed')}</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {isCompleted && (
        <View style={styles.bottomContainer}>
          <View style={styles.completedBanner}>
            <TickIcon />
            <Text style={styles.completedBannerText}>This job has been completed</Text>
          </View>
        </View>
      )}

      <CancelJobModal
        visible={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelConfirm} // ⬅ FIXED: was a console.log stub
      />

      {/* ⬅ NEW */}
      <OtpVerifyModal
        visible={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onSubmit={handleOtpSubmit}
        loading={verifyingOtp}
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

  // ── Status row ─────────────────────────────────────────────────────────────
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 18,
    marginBottom: 14,
  },

  statusBadge: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusBadgeCompleted: {
    backgroundColor: '#1976D2',
  },

  statusBadgeText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: '600',
    fontSize: 14,
  },

  jobId: {
    color: '#666',
    fontWeight: '600',
    fontSize: 14,
  },

  // ── Customer card ─────────────────────────────────────────────────────────
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
    flex: 1,
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 14,
  },

  avatarFallback: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFE0CC',
    borderWidth: 2,
    borderColor: '#FF5A00',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  avatarInitials: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FF5A00',
  },

  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
  },

  phone: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },

  ratingRow: {
    flexDirection: 'row',
    marginTop: 4,
    alignItems: 'center',
  },

  ratingText: {
    color: '#555',
    fontSize: 13,
  },

  quickCallBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF5A00',
    justifyContent: 'center',
    alignItems: 'center',
  },

  quickCallText: {
    fontSize: 20,
  },

  // ── Skill / Payment badges ────────────────────────────────────────────────
  skillRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 14,
    gap: 10,
  },

  skillBadge: {
    backgroundColor: '#FFF0E5',
    borderWidth: 1,
    borderColor: '#FFD7C2',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },

  skillText: {
    color: '#FF5A00',
    fontWeight: '700',
    fontSize: 13,
  },

  paymentBadge: {
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: '#C8E6C9',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },

  paymentText: {
    color: '#2E7D32',
    fontWeight: '700',
    fontSize: 13,
  },

  // ── Schedule & Budget cards ───────────────────────────────────────────────
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 16,
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
    fontSize: 12,
  },

  bigText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF5A00',
    marginTop: 12,
  },

  smallText: {
    color: '#FF7A2E',
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
  },

  // ── Location card ─────────────────────────────────────────────────────────
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

  mapPlaceholder: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF8F5',
  },

  mapPlaceholderText: {
    color: '#FF5A00',
    fontSize: 16,
    fontWeight: '600',
  },

  addressSection: {
    padding: 16,
  },

  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  addressTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
  },

  address: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },

  distanceText: {
    marginTop: 8,
    fontSize: 14,
    color: '#FF5A00',
    fontWeight: '700',
  },

  navigateBtn: {
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: '#FF5A00',
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  navigateText: {
    marginLeft: 8,
    color: '#FF5A00',
    fontWeight: '700',
    fontSize: 16,
  },

  // ── Description card ──────────────────────────────────────────────────────
  descCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#FFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    padding: 16,
  },

  descTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginBottom: 8,
  },

  descText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },

  // ── Bottom actions ────────────────────────────────────────────────────────
  bottomContainer: {
    backgroundColor: '#FFF',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#EEE',
  },

  callBtn: {
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FF5A00',
    justifyContent: 'center',
    alignItems: 'center',
  },

  callText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },

  bottomRow: {
    marginTop: 14,
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
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 80,
    justifyContent: 'center',
  },

  completedText: {
    marginLeft: 6,
    color: '#0B3D12',
    fontWeight: '700',
    fontSize: 15,
  },

  completedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 14,
  },

  completedBannerText: {
    marginLeft: 8,
    color: '#2E7D32',
    fontWeight: '700',
    fontSize: 16,
  },
});