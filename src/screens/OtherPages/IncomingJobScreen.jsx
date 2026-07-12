import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { startRinging, stopRinging } from '../../services/ringtone';
import {
  getIncomingDispatchByRequirement,
  acceptDispatch,
  declineDispatch,
} from '../../services/dispatch';
import { getCurrentLocation } from '../../services/location';
import { getSocket } from '../../services/socket'; // ⬅ NEW: adjust path/name if yours differs

const WAVE_TIMEOUT_S = 30; // matches backend WAVE_TIMEOUT_MS
const AVG_SPEED_KMPH = 25; // rough city-traffic estimate, used only for the "min away" hint
const AUTO_DISMISS_MS = 1600; // how long to show "already taken" before closing

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

const IncomingJobScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const {
    requirementId,
    jobId,
    skillType,
    ratePerDay,
    expiresAt,
    onResolved,
  } = route.params || {};

  const [loadingDetail, setLoadingDetail] = useState(true);
  const [customer, setCustomer] = useState(null);
  const [distance, setDistance] = useState(null); // { km, mins }
  const [actionLoading, setActionLoading] = useState(false); // accept/decline in-flight
  const [secondsLeft, setSecondsLeft] = useState(WAVE_TIMEOUT_S);
  const [takenByOther, setTakenByOther] = useState(false); // ⬅ NEW

  const resolvedRef = useRef(false);
  const pulse = useRef(new Animated.Value(0)).current;

  // ── Resolve once (accept, decline, expire, or unmount) ──────────────────
  const resolve = useCallback(() => {
    if (resolvedRef.current) return;
    resolvedRef.current = true;
    stopRinging();
    if (onResolved) onResolved();
  }, [onResolved]);

  // ── Ringtone + vibration, like an incoming Uber ride ─────────────────────
  useEffect(() => {
    startRinging();
    return () => {
      resolve();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Block hardware back button — worker must accept/decline ─────────────
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => sub.remove();
  }, []);

  // ── NEW: if another worker accepts first, close this screen out ─────────
  useEffect(() => {
    const socket = getSocket?.();
    if (!socket) return;

    const handleJobTaken = (payload) => {
      // payload shape assumed: { jobId, requirementId } — adjust to match
      // whatever your backend actually sends on this event.
      const matchesThisJob =
        (payload?.requirementId && payload.requirementId === requirementId) ||
        (payload?.jobId && payload.jobId === jobId);

      if (!matchesThisJob || resolvedRef.current || actionLoading) return;

      stopRinging();
      setTakenByOther(true);

      setTimeout(() => {
        resolve();
        if (navigation.canGoBack()) navigation.goBack();
      }, AUTO_DISMISS_MS);
    };

    socket.on('job:fully_booked', handleJobTaken);

    return () => {
      socket.off('job:fully_booked', handleJobTaken);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requirementId, jobId, navigation, resolve]);

  // ── Gentle pulse on the bell pill, like a ring animation ─────────────────
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 550,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 550,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const bellScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] });

  // ── Countdown based on the wave's expiresAt timestamp ────────────────────
  useEffect(() => {
    if (takenByOther) return; // ⬅ NEW: stop counting once we know it's gone

    const expiryTime = expiresAt ? new Date(expiresAt).getTime() : Date.now() + WAVE_TIMEOUT_S * 1000;

    const tick = () => {
      const remaining = Math.max(0, Math.round((expiryTime - Date.now()) / 1000));
      setSecondsLeft(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        resolve();
        if (navigation.canGoBack()) navigation.goBack();
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, navigation, resolve, takenByOther]);

  // ── Fetch full job + customer detail via the job APIs ────────────────────
  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const dispatchEntry = await getIncomingDispatchByRequirement(requirementId);
        const job = dispatchEntry?.job_requirement?.job;

        if (isMounted && job) {
          setCustomer(job.customer || null);

          if (job.latitude != null && job.longitude != null) {
            try {
              const here = await getCurrentLocation();
              const km = distanceKm(here.latitude, here.longitude, job.latitude, job.longitude);
              setDistance({
                km: km.toFixed(1),
                mins: Math.max(1, Math.round((km / AVG_SPEED_KMPH) * 60)),
              });
            } catch (locErr) {
              console.log('[IncomingJobScreen] Could not get worker location:', locErr?.message);
            }
          }
        }
      } catch (err) {
        console.log('[IncomingJobScreen] Failed to load job detail:', err?.message);
      } finally {
        if (isMounted) setLoadingDetail(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [requirementId]);

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleAccept = async () => {
    if (actionLoading || takenByOther || !requirementId) return; // ⬅ guard added
    setActionLoading(true);
    try {
      const response = await acceptDispatch(requirementId);
      resolve();
      navigation.replace('JobDetails', { booking: response?.data, jobId, requirementId });
    } catch (err) {
      console.log('[IncomingJobScreen] Accept failed:', err?.message);
      setActionLoading(false);

      // ⬅ NEW: if the backend rejects because someone else already took it,
      // treat it the same as the socket event (covers the race where the
      // event arrives slightly after our own accept request).
      if (err?.response?.status === 409 || err?.code === 'JOB_ALREADY_TAKEN') {
        setTakenByOther(true);
        setTimeout(() => {
          resolve();
          if (navigation.canGoBack()) navigation.goBack();
        }, AUTO_DISMISS_MS);
      }
    }
  };

  const handleDecline = async () => {
    if (actionLoading || takenByOther || !requirementId) return; // ⬅ guard added
    setActionLoading(true);
    try {
      await declineDispatch(requirementId);
    } catch (err) {
      console.log('[IncomingJobScreen] Decline failed:', err?.message);
    } finally {
      resolve();
      setActionLoading(false);
      if (navigation.canGoBack()) navigation.goBack();
    }
  };

  const timeUp = secondsLeft <= 5;

  // ⬅ NEW: early-return a small "already taken" version of the card
  if (takenByOther) {
    return (
      <View style={styles.backdrop}>
        <SafeAreaView style={styles.safe} edges={['bottom']}>
          <View style={styles.card}>
            <View style={styles.takenWrap}>
              <Text style={styles.takenEmoji}>⚡</Text>
              <Text style={styles.takenTitle}>
                {t('jobs.incomingJob.takenTitle', 'Already Accepted')}
              </Text>
              <Text style={styles.takenSubtitle}>
                {t(
                  'jobs.incomingJob.takenSubtitle',
                  'This job was just accepted by another worker.'
                )}
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.backdrop}>
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <View style={styles.card}>
          {/* Alert pill */}
          <View style={styles.alertPillWrap}>
            <Animated.View style={[styles.alertPill, { transform: [{ scale: bellScale }] }]}>
              <Text style={styles.bellEmoji}>🔔</Text>
              <Text style={styles.alertPillText}>
                {t('jobs.incomingJob.title', 'New Job Alert')}
              </Text>
            </Animated.View>
          </View>

          {/* Customer row */}
          <View style={styles.customerRow}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
              style={styles.avatar}
            />
            <View style={styles.customerTextWrap}>
              {loadingDetail ? (
                <ActivityIndicator color="#FF5A00" style={{ alignSelf: 'flex-start' }} />
              ) : (
                <>
                  <Text style={styles.customerName} numberOfLines={1}>
                    {customer?.name || t('jobs.incomingJob.customerFallback', 'Customer')}
                  </Text>
                  {customer?.phone ? (
                    <Text style={styles.customerPhone}>{customer.phone}</Text>
                  ) : null}
                </>
              )}
            </View>
          </View>

          <View style={styles.hr} />

          {/* Distance + Budget boxes */}
          <View style={styles.boxRow}>
            <View style={styles.box}>
              <Text style={styles.boxLabel}>{t('jobs.incomingJob.distance', 'DISTANCE')}</Text>
              {distance ? (
                <>
                  <Text style={styles.boxValue}>
                    {distance.km} <Text style={styles.boxUnit}>km</Text>
                  </Text>
                  <Text style={styles.boxSubtext}>
                    🚶 {distance.mins} {t('jobs.incomingJob.minAway', 'min away')}
                  </Text>
                </>
              ) : (
                <Text style={styles.boxValueDim}>—</Text>
              )}
            </View>

            <View style={[styles.box, styles.boxBudget]}>
              <Text style={styles.boxLabelBudget}>{t('jobs.incomingJob.estBudget', 'EST. BUDGET')}</Text>
              <Text style={styles.boxValueBudget}>₹{ratePerDay ?? '—'}</Text>
              <Text style={styles.boxSubtext}>{skillType || t('jobs.incomingJob.cashOnCompletion', 'Cash on completion')}</Text>
            </View>
          </View>

          {/* Countdown */}
          <View style={[styles.timeBox, timeUp && styles.timeBoxUrgent]}>
            <Text style={styles.timeLabel}>{t('jobs.incomingJob.timeToAccept', 'TIME TO ACCEPT')}</Text>
            <Text style={styles.timeValue}>
              ⏱ 00:{String(secondsLeft).padStart(2, '0')}
            </Text>
          </View>

          {/* Actions */}
          <TouchableOpacity
            style={styles.acceptBtn}
            onPress={handleAccept}
            disabled={actionLoading}
            activeOpacity={0.85}
          >
            {actionLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.acceptText}>
                ✓  {t('jobs.incomingJob.accept', 'ACCEPT JOB')}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.declineBtn}
            onPress={handleDecline}
            disabled={actionLoading}
            activeOpacity={0.7}
          >
            <Text style={styles.declineText}>
              ✕  {t('jobs.incomingJob.decline', 'Decline')}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default IncomingJobScreen;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 15, 20, 0.55)',
    justifyContent: 'flex-end',
  },
  safe: { width: '100%' },
  card: {
    backgroundColor: '#FAFAFA',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  // ⬅ NEW styles for the "already taken" state
  takenWrap: {
    paddingVertical: 40,
    paddingTop: 24,
    alignItems: 'center',
  },
  takenEmoji: { fontSize: 34, marginBottom: 10 },
  takenTitle: {
    color: '#1A1A1A',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  takenSubtitle: {
    color: '#8A8A8A',
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  alertPillWrap: { alignItems: 'center', marginTop: -18, marginBottom: 18 },
  alertPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF5A00',
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 22,
    shadowColor: '#FF5A00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  bellEmoji: { fontSize: 14, marginRight: 6 },
  alertPillText: { color: '#fff', fontWeight: '700', fontSize: 14, letterSpacing: 0.2 },
  customerRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#E5E5E5' },
  customerTextWrap: { marginLeft: 14, flex: 1, justifyContent: 'center' },
  customerName: { color: '#1A1A1A', fontSize: 19, fontWeight: '700' },
  customerPhone: { color: '#8A8A8A', fontSize: 13, marginTop: 2 },
  hr: { height: 1, backgroundColor: '#E8E8E8', marginVertical: 18 },
  boxRow: { flexDirection: 'row', gap: 12 },
  box: { flex: 1, backgroundColor: '#F2EEEA', borderRadius: 16, padding: 14 },
  boxBudget: { backgroundColor: '#FFF1E8' },
  boxLabel: { color: '#6B6B6B', fontSize: 11, fontWeight: '700', letterSpacing: 0.4 },
  boxLabelBudget: { color: '#FF7A2E', fontSize: 11, fontWeight: '700', letterSpacing: 0.4 },
  boxValue: { color: '#1A1A1A', fontSize: 22, fontWeight: '700', marginTop: 6 },
  boxValueDim: { color: '#B0B0B0', fontSize: 22, fontWeight: '700', marginTop: 6 },
  boxUnit: { fontSize: 13, fontWeight: '600', color: '#6B6B6B' },
  boxValueBudget: { color: '#FF5A00', fontSize: 22, fontWeight: '800', marginTop: 6 },
  boxSubtext: { color: '#8A8A8A', fontSize: 11, marginTop: 4 },
  timeBox: { backgroundColor: '#F6EDEA', borderRadius: 16, paddingVertical: 14, alignItems: 'center', marginTop: 14 },
  timeBoxUrgent: { backgroundColor: '#FDE3E1' },
  timeLabel: { color: '#C0392B', fontSize: 11, fontWeight: '700', letterSpacing: 0.6 },
  timeValue: { color: '#C0392B', fontSize: 22, fontWeight: '800', marginTop: 4 },
  acceptBtn: {
    backgroundColor: '#FF5A00',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#FF5A00',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  acceptText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
  declineBtn: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1.5,
    borderColor: '#3A3A3A',
  },
  declineText: { color: '#3A3A3A', fontSize: 16, fontWeight: '600' },
});