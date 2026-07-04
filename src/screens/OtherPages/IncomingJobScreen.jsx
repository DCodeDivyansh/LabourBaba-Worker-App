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

import LocationIcon from '../../../assets/Location.svg';
import MoneyIcon from '../../../assets/MoneyIcon.svg';
import CallIcon from '../../../assets/call.svg';

import { startRinging, stopRinging } from '../../services/ringtone';
import {
  getIncomingDispatchByRequirement,
  acceptDispatch,
  declineDispatch,
} from '../../services/dispatch';

const WAVE_TIMEOUT_S = 30; // matches backend WAVE_TIMEOUT_MS

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
  const [jobLocation, setJobLocation] = useState(null);
  const [actionLoading, setActionLoading] = useState(false); // accept/decline in-flight
  const [secondsLeft, setSecondsLeft] = useState(WAVE_TIMEOUT_S);

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

  // ── Pulsing ring animation around the customer avatar ───────────────────
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(pulse, {
        toValue: 1,
        duration: 1400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const pulseScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.9] });
  const pulseOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] });

  // ── Countdown based on the wave's expiresAt timestamp ────────────────────
  useEffect(() => {
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
  }, [expiresAt, navigation, resolve]);

  // ── Fetch full job + customer detail via the job APIs ────────────────────
  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const dispatchEntry = await getIncomingDispatchByRequirement(requirementId);
        const job = dispatchEntry?.job_requirement?.job;

        if (isMounted && job) {
          console.log('========== CUSTOMER DATA ==========');
          console.log(job.customer);
          console.log('====================================');

          setCustomer(job.customer || null);
          setJobLocation(job.location || null);
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
    if (actionLoading || !requirementId) return;
    setActionLoading(true);
    try {
      const response = await acceptDispatch(requirementId);
      resolve();
      navigation.replace('JobDetails', { booking: response?.data, jobId, requirementId });
    } catch (err) {
      console.log('[IncomingJobScreen] Accept failed:', err?.message);
      setActionLoading(false);
    }
  };

  const handleDecline = async () => {
    if (actionLoading || !requirementId) return;
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

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.timerPill}>
          <Text style={styles.timerText}>{secondsLeft}s</Text>
        </View>
        <Text style={styles.headerTitle}>{t('jobs.incomingJob.title', 'New Job Request')}</Text>
        <Text style={styles.headerSubtitle}>
          {t('jobs.incomingJob.subtitle', 'Respond before it goes to another worker')}
        </Text>
      </View>

      <View style={styles.avatarWrap}>
        <Animated.View
          style={[
            styles.pulseRing,
            { transform: [{ scale: pulseScale }], opacity: pulseOpacity },
          ]}
        />
        <Image
          source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
          style={styles.avatar}
        />
      </View>

      {loadingDetail ? (
        <ActivityIndicator color="#FF5A00" style={{ marginTop: 12 }} />
      ) : (
        <>
          <Text style={styles.customerName}>
            {customer?.name || t('jobs.incomingJob.customerFallback', 'Customer')}
          </Text>
          {customer?.phone ? (
            <View style={styles.phoneRow}>
              <CallIcon width={16} height={16} />
              <Text style={styles.phoneText}>{customer.phone}</Text>
            </View>
          ) : null}
        </>
      )}

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{t('jobs.incomingJob.skill', 'Skill Required')}</Text>
          <Text style={styles.infoValue}>{skillType || '—'}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <View style={styles.infoLabelRow}>
            <MoneyIcon width={16} height={16} />
            <Text style={styles.infoLabel}>{t('jobs.incomingJob.rate', 'Rate')}</Text>
          </View>
          <Text style={styles.infoValueHighlight}>₹{ratePerDay ?? '—'}/day</Text>
        </View>

        {jobLocation ? (
          <>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <View style={styles.infoLabelRow}>
                <LocationIcon width={16} height={16} />
                <Text style={styles.infoLabel}>{t('jobs.incomingJob.location', 'Location')}</Text>
              </View>
              <Text style={styles.infoValue} numberOfLines={2}>
                {jobLocation}
              </Text>
            </View>
          </>
        ) : null}
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.declineBtn]}
          onPress={handleDecline}
          disabled={actionLoading}
        >
          {actionLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.declineText}>{t('jobs.incomingJob.decline', 'Decline')}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.acceptBtn]}
          onPress={handleAccept}
          disabled={actionLoading}
        >
          {actionLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.acceptText}>{t('jobs.incomingJob.accept', 'Accept Job')}</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default IncomingJobScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0B0B',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  header: {
    alignItems: 'center',
    marginTop: 12,
  },

  timerPill: {
    backgroundColor: '#FF5A00',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 10,
  },

  timerText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },

  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },

  headerSubtitle: {
    color: '#AAAAAA',
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },

  avatarWrap: {
    marginTop: 28,
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },

  pulseRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#FF5A00',
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FF5A00',
  },

  customerName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 16,
  },

  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },

  phoneText: {
    color: '#CCCCCC',
    fontSize: 14,
    marginLeft: 6,
  },

  infoCard: {
    width: '100%',
    backgroundColor: '#1A1A1A',
    borderRadius: 18,
    padding: 18,
    marginTop: 24,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  infoLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoLabel: {
    color: '#999999',
    fontSize: 14,
    marginLeft: 6,
  },

  infoValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    maxWidth: '60%',
    textAlign: 'right',
  },

  infoValueHighlight: {
    color: '#FF5A00',
    fontSize: 18,
    fontWeight: '700',
  },

  divider: {
    height: 1,
    backgroundColor: '#2A2A2A',
    marginVertical: 12,
  },

  actionsRow: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 'auto',
    marginBottom: 24,
    gap: 12,
  },

  actionBtn: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },

  declineBtn: {
    backgroundColor: '#3A1A1A',
    borderWidth: 1,
    borderColor: '#D32F2F',
  },

  declineText: {
    color: '#D32F2F',
    fontSize: 17,
    fontWeight: '700',
  },

  acceptBtn: {
    backgroundColor: '#33A852',
  },

  acceptText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});
