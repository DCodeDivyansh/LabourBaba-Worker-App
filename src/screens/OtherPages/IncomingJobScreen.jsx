import React, { useEffect, useRef } from 'react';
import {
  Animated,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useIncomingJob } from '../../context/IncomingJobContext';

const COLORS = {
  primary: '#FF5404',
  primaryLight: '#FFF1EA',
  background: '#F8F9FB',
  card: '#FFFFFF',
  text: '#1A1A1A',
  subtext: '#6B7280',
  border: '#F0E4DC',
  danger: '#DC2626',
};

function getInitials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function IncomingJobScreen() {
  const { currentJob, secondsRemaining, accept, reject } = useIncomingJob();
  const cardAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (currentJob) {
      cardAnim.setValue(0);
      Animated.spring(cardAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 7,
        tension: 60,
      }).start();
    }
  }, [currentJob, cardAnim]);

  if (!currentJob) {
    return null;
  }

  const translateY = cardAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [400, 0],
  });

  // These field names now match exactly what notifyWorkers() in
  // simpleDispatch.ts actually sends (both the FCM `data` payload and the
  // Socket.IO `job:incoming` emit use the same keys):
  //   customerName, location, ratePerDay, distanceMeters, distanceText,
  //   jobId, requirementId, expiresAt
  // NOTE: the backend does not currently send `rating`, `jobsCompleted`,
  // or `etaMinutes` — those were fields I'd guessed at earlier and don't
  // exist on the real payload, which is why they rendered as blank/'--'.
  // I've left them in as optional (only shown if present) in case you add
  // them later, but removed them from anywhere they'd otherwise show as
  // "undefined" or force a fallback.
  const {
    customerName,
    customerPhone,
    location,
    ratePerDay,
    distanceText,   // e.g. "2.5 km" — now computed client-side in IncomingJobContext
    rating,         // optional — not sent yet, shown only if present
    jobsCompleted,  // optional — not sent yet, shown only if present
  } = currentJob;

  const initials = getInitials(customerName);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.card, { transform: [{ translateY }] }]}>
        {/* Alert badge */}
        <View style={styles.badgeWrap}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>🔔  New Job Alert</Text>
          </View>
        </View>

        {/* Customer row */}
        <View style={styles.customerRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.customerName}>{customerName || 'Customer'}</Text>
            {rating != null && (
              <Text style={styles.ratingText}>
                ⭐ {rating}
                {jobsCompleted != null ? `  (${jobsCompleted}+ jobs)` : ''}
              </Text>
            )}
            {!!location && <Text style={styles.locationText}>{location}</Text>}
            {!!customerPhone && <Text style={styles.locationText}>{customerPhone}</Text>}
          </View>
        </View>

        <View style={styles.divider} />

        {/* Stat boxes */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>👜  DISTANCE</Text>
            <Text style={styles.statValue}>{distanceText || '--'}</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statLabel}>💰  RATE</Text>
            <Text style={styles.statValue}>
              {ratePerDay ? `₹${ratePerDay}` : '--'}
            </Text>
            <Text style={styles.statSub}>per day</Text>
          </View>
        </View>

        {/* Countdown */}
        <View style={styles.timerBox}>
          <Text style={styles.timerLabel}>TIME TO ACCEPT</Text>
          <Text style={styles.timerValue}>
            ⏱ 00:{String(secondsRemaining).padStart(2, '0')}
          </Text>
        </View>

        {/* Actions */}
        <TouchableOpacity style={styles.acceptButton} onPress={accept}>
          <Text style={styles.acceptText}>✓  Accept Job</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.declineButton} onPress={reject}>
          <Text style={styles.declineText}>✕  Decline</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  badgeWrap: {
    alignItems: 'center',
    marginBottom: 16,
    marginTop: -36,
  },
  badge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  avatarText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 18,
  },
  customerName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  ratingText: {
    fontSize: 13,
    color: COLORS.subtext,
    marginBottom: 2,
  },
  locationText: {
    fontSize: 13,
    color: COLORS.subtext,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEE',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 16,
    padding: 14,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  statSub: {
    fontSize: 11,
    color: COLORS.subtext,
    marginTop: 4,
  },
  timerBox: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  timerLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  timerValue: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.primary,
  },
  acceptButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  acceptText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  declineButton: {
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
  },
  declineText: {
    color: COLORS.subtext,
    fontWeight: '700',
    fontSize: 15,
  },
});