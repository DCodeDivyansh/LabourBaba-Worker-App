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

import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'; // ⬅ CHANGED: added useSafeAreaInsets
import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'; // ⬅ NEW
import TopAppBar from '../../components/TopAppBar';
import TickIcon from '../../../assets/TickIcon.svg';
import LocationIcon from '../../../assets/Location.svg';
import MoneyIcon from '../../../assets/MoneyIcon.svg';
import CalenderIcon from '../../../assets/CalenderIcon.svg';
import NavigateIcon from '../../../assets/Navigateicon.svg';
import CancelJobModal from './CancelJobModal';
import { useTranslation } from 'react-i18next';
import { getCurrentLocation } from '../../services/location';
import { getBookingDetail, getWorkerBookings, completeBooking, verifyOtp, cancelBooking } from '../../services/booking';
import { emitJobCompleted, emitJobCancelled } from '../../services/events';
import OtpVerifyModal from '../../components/OtpVerifyModal';
import { colors, radius, shadow } from '../../theme/theme'; // ⬅ NEW: unify with the rest of the app's design system

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
  const insets = useSafeAreaInsets(); // ⬅ NEW
  const { bookingId, booking: initialBooking } = route.params || {};

  const [booking, setBooking] = useState(initialBooking || null);
  const [loading, setLoading] = useState(!initialBooking);
  const [distance, setDistance] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [completing, setCompleting] = useState(false);

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const loadBookingData = async () => {
      try {
        let active = initialBooking;
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

  const handleOtpSubmit = async (otp) => {
    if (verifyingOtp || !booking?.id) return;

    // ⬅ NEW: client-side-only sanitization. SMS autofill on some Android
    // keyboards can append a trailing space/newline, and some OTP input
    // components can pass through non-digit characters if the user
    // backspaces/edits mid-way. Stripping to digits-only and trimming here
    // guarantees exactly what was generated is what gets sent — no backend
    // changes needed since this happens entirely before the request goes out.
    const sanitizedOtp = String(otp ?? '').replace(/\D/g, '').trim();

    if (sanitizedOtp.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter the full 6-digit code.');
      return;
    }

    setVerifyingOtp(true);
    try {
      const response = await verifyOtp(booking.id, sanitizedOtp);
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

              if (response?.success === false) {
                throw new Error(response?.message || 'Failed to complete job');
              }

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
        <ActivityIndicator size="large" color={colors.primary} />
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

  const customerName = booking.customer?.name || 'Customer';
  const customerPhone = booking.customer?.phone || null;
  const customerInitials = getInitials(customerName);
  const customerAvatar = booking.customer?.avatar || booking.customer?.photo || null;

  const ratePerDay =
    booking.job_requirement?.rate_per_day || booking.job?.budget || '—';
  const skillType =
    booking.job_requirement?.skill_type || booking.job?.skill_type || '—';
  const scheduledDate = booking.scheduled_at || booking.created_at;

  const statusLower = booking.status?.toLowerCase() || '';
  const isCompleted = statusLower === 'completed';
  const isInProgress = statusLower === 'in_progress';
  const needsOtp = !isCompleted && !isInProgress;

  const hasCoords = booking.job?.latitude != null && booking.job?.longitude != null;

  return (
    <View style={styles.container}>
      <TopAppBar title={t('jobs.jobDetails.screenTitle')} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        // ⬅ CHANGED: extra bottom padding scoped to whatever the fixed
        // bottomContainer actually ends up occupying (see below), so
        // scroll content never sits underneath it regardless of device.
        contentContainerStyle={{ paddingBottom: 140 + insets.bottom }}
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

          {customerPhone ? (
            <TouchableOpacity style={styles.quickCallBtn} onPress={handleCall} activeOpacity={0.85}>
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
          {hasCoords ? (
            <TouchableOpacity activeOpacity={0.9} onPress={handleNavigate}>
              <MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                  latitude: booking.job.latitude,
                  longitude: booking.job.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
                pitchEnabled={false}
                rotateEnabled={false}
                pointerEvents="none"
              >
                <Marker
                  coordinate={{
                    latitude: booking.job.latitude,
                    longitude: booking.job.longitude,
                  }}
                  pinColor={colors.primary}
                />
              </MapView>

              <View style={styles.mapTapHint}>
                <Text style={styles.mapTapHintText}>Tap to open in Maps</Text>
              </View>
            </TouchableOpacity>
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

            <TouchableOpacity style={styles.navigateBtn} onPress={handleNavigate} activeOpacity={0.85}>
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
        <View style={[styles.bottomContainer, { paddingBottom: 16 + insets.bottom }]}>
          <TouchableOpacity style={styles.callBtn} onPress={handleCall} activeOpacity={0.85}>
            <Text style={styles.callText}>📞 {t('jobs.jobDetails.callCustomer', 'Call Customer')}</Text>
          </TouchableOpacity>

          <View style={styles.bottomRow}>
            <TouchableOpacity onPress={() => setShowCancelModal(true)}>
              <Text style={styles.cancelText}>{t('jobs.jobDetails.cancelJob', 'Cancel Job')}</Text>
            </TouchableOpacity>

            {needsOtp ? (
              <TouchableOpacity style={styles.completedBtn} onPress={() => setShowOtpModal(true)} activeOpacity={0.85}>
                <Text style={styles.completedText}>🔑 Verify OTP to Start</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.completedBtn} onPress={handleComplete} disabled={completing} activeOpacity={0.85}>
                {completing ? (
                  <ActivityIndicator size="small" color={colors.success} />
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
        <View style={[styles.bottomContainer, { paddingBottom: 16 + insets.bottom }]}>
          <View style={styles.completedBanner}>
            <TickIcon />
            <Text style={styles.completedBannerText}>This job has been completed</Text>
          </View>
        </View>
      )}

      <CancelJobModal
        visible={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelConfirm}
      />

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
    backgroundColor: colors.background,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  noJobText: {
    fontSize: 18,
    color: colors.inkMuted,
  },

  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 18,
    marginBottom: 14,
  },

  statusBadge: {
    backgroundColor: colors.success,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },

  statusBadgeCompleted: {
    backgroundColor: colors.info,
  },

  statusBadgeText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: '600',
    fontSize: 14,
  },

  jobId: {
    color: colors.inkMuted,
    fontWeight: '600',
    fontSize: 14,
  },

  profileCard: {
    marginHorizontal: 16,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shadow.card,
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
    backgroundColor: colors.primaryLight,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  avatarInitials: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
  },

  name: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.ink,
  },

  phone: {
    fontSize: 14,
    color: colors.inkMuted,
    marginTop: 2,
  },

  ratingRow: {
    flexDirection: 'row',
    marginTop: 4,
    alignItems: 'center',
  },

  ratingText: {
    color: colors.inkMuted,
    fontSize: 13,
  },

  quickCallBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  quickCallText: {
    fontSize: 20,
  },

  skillRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 14,
    gap: 10,
  },

  skillBadge: {
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radius.pill,
  },

  skillText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 13,
  },

  paymentBadge: {
    backgroundColor: colors.successBg,
    borderWidth: 1,
    borderColor: '#C8E6C9',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radius.pill,
  },

  paymentText: {
    color: colors.success,
    fontWeight: '700',
    fontSize: 13,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 16,
  },

  infoCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    ...shadow.card,
  },

  cardLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  cardLabelText: {
    marginLeft: 6,
    color: colors.primary,
    fontWeight: '700',
    fontSize: 12,
  },

  bigText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.ink,
    marginTop: 12,
  },

  smallText: {
    color: colors.inkSoft,
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
  },

  locationCard: {
    margin: 16,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },

  map: {
    width: '100%',
    height: 170,
  },

  mapTapHint: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },

  mapTapHintText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },

  mapPlaceholder: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
  },

  mapPlaceholderText: {
    color: colors.primary,
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
    color: colors.ink,
  },

  address: {
    marginTop: 10,
    fontSize: 16,
    color: colors.inkMuted,
    lineHeight: 24,
  },

  distanceText: {
    marginTop: 8,
    fontSize: 14,
    color: colors.primary,
    fontWeight: '700',
  },

  navigateBtn: {
    height: 46,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.primary,
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  navigateText: {
    marginLeft: 8,
    color: colors.primary,
    fontWeight: '700',
    fontSize: 16,
  },

  descCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },

  descTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 8,
  },

  descText: {
    fontSize: 15,
    color: colors.inkMuted,
    lineHeight: 22,
  },

  bottomContainer: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: colors.border,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },

  callBtn: {
    height: 52,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
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
    color: colors.danger,
    fontWeight: '700',
    fontSize: 16,
  },

  completedBtn: {
    backgroundColor: colors.successBg,
    borderWidth: 1,
    borderColor: colors.success,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 80,
    justifyContent: 'center',
  },

  completedText: {
    marginLeft: 6,
    color: colors.success,
    fontWeight: '700',
    fontSize: 15,
  },

  completedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.successBg,
    borderRadius: radius.md,
    padding: 14,
  },

  completedBannerText: {
    marginLeft: 8,
    color: colors.success,
    fontWeight: '700',
    fontSize: 16,
  },
});