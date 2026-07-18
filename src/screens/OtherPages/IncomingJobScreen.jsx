import React, { useEffect, useRef } from 'react';
import {
  Animated,
  BackHandler,
  Easing,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useIncomingJob } from '../../context/IncomingJobContext';
import { colors, radius, spacing, typography, shadow } from '../../theme/theme';

function getInitials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function IncomingJobScreen() {
  const { currentJob, secondsRemaining, totalSeconds, accept, reject } = useIncomingJob();

  // Two-stage entrance, matched to real dispatch/call UIs: the dim backdrop
  // fades in immediately (so there is never a blank/white frame, even for a
  // single frame), then the offer card springs up from the bottom once it
  // mounts. These are separate Animated values so the backdrop is never
  // gated behind currentJob existing.
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;
  const ringAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(backdropAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [backdropAnim]);

  useEffect(() => {
    if (!currentJob) return;

    cardAnim.setValue(0);
    Animated.spring(cardAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
      tension: 65,
    }).start();

    // Radar-style pulse behind the avatar while the offer is "ringing" —
    // the same visual cue used by call/dispatch apps to signal "waiting for
    // your response" without saying so in text.
    ringAnim.setValue(0);
    const pulse = Animated.loop(
      Animated.timing(ringAnim, {
        toValue: 1,
        duration: 1400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    );
    pulse.start();
    return () => pulse.stop();
  }, [currentJob, cardAnim, ringAnim]);

  // Block the hardware back button while an offer is active — declining
  // must be an explicit, deliberate action (Decline button), not an
  // accidental back-press dismissal, same as any real call/order screen.
  useEffect(() => {
    if (!currentJob) return undefined;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => sub.remove();
  }, [currentJob]);

  useEffect(() => {
    const ratio = totalSeconds > 0 ? secondsRemaining / totalSeconds : 0;
    Animated.timing(progressAnim, {
      toValue: Math.max(0, Math.min(1, ratio)),
      duration: 350,
      easing: Easing.linear,
      useNativeDriver: false, // width % can't use the native driver
    }).start();
  }, [secondsRemaining, totalSeconds, progressAnim]);

  const translateY = cardAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [420, 0],
  });

  const ringScale = ringAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.9] });
  const ringOpacity = ringAnim.interpolate({ inputRange: [0, 0.6, 1], outputRange: [0.35, 0.12, 0] });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const urgent = secondsRemaining <= 10;

  // These field names match what notifyWorkers() in simpleDispatch.ts sends
  // (both the FCM `data` payload and the Socket.IO `job:incoming` emit use
  // the same keys): customerName, location, ratePerDay, distanceText,
  // jobId, requirementId, expiresAt. `rating`/`jobsCompleted` are not sent
  // by the backend yet — only rendered if present.
  const job = currentJob;
  const initials = getInitials(job?.customerName);
  const hasDistance = !!job?.distanceText;
  const hasRate = !!job?.ratePerDay;

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        pointerEvents="none"
        style={[styles.backdrop, { opacity: backdropAnim }]}
      />

      {job ? (
        <Animated.View style={[styles.card, { transform: [{ translateY }] }]}>
          {/* Countdown progress bar — the primary "time is running out" cue,
              a thin bar instead of a wall of digits, that visibly races down
              as secondsRemaining ticks. */}
          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressFill,
                { width: progressWidth, backgroundColor: urgent ? colors.danger : colors.primary },
              ]}
            />
          </View>

          <View style={styles.badgeWrap}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>NEW JOB OFFER</Text>
            </View>
            <Text style={[styles.timerValue, urgent && styles.timerValueUrgent]}>
              00:{String(secondsRemaining).padStart(2, '0')}
            </Text>
          </View>

          <View style={styles.customerRow}>
            <View style={styles.avatarWrap}>
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.ring,
                  { opacity: ringOpacity, transform: [{ scale: ringScale }] },
                ]}
              />
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
            </View>

            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <Text style={styles.customerName} numberOfLines={1}>
                {job.customerName || 'Customer'}
              </Text>
              {job.rating != null && (
                <Text style={styles.metaText}>
                  ⭐ {job.rating}
                  {job.jobsCompleted != null ? `  ·  ${job.jobsCompleted}+ jobs` : ''}
                </Text>
              )}
              {!!job.location && (
                <Text style={styles.metaText} numberOfLines={1}>
                  📍 {job.location}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>DISTANCE</Text>
              {hasDistance ? (
                <Text style={styles.statValue}>{job.distanceText}</Text>
              ) : (
                <View style={styles.statSkeleton} />
              )}
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statBox}>
              <Text style={styles.statLabel}>DAILY RATE</Text>
              {hasRate ? (
                <Text style={styles.statValue}>₹{job.ratePerDay}</Text>
              ) : (
                <View style={styles.statSkeleton} />
              )}
            </View>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.declineButton}
              activeOpacity={0.75}
              onPress={reject}
            >
              <Text style={styles.declineText}>Decline</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.acceptButton}
              activeOpacity={0.85}
              onPress={accept}
            >
              <Text style={styles.acceptText}>Accept Job</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      ) : (
        // Zero-blank-frame guarantee: if this screen is ever on-screen for a
        // moment before context state lands (should be sub-frame in
        // practice), show the same dim backdrop with a lightweight ringing
        // cue instead of nothing. There is never a raw white/empty frame.
        <View style={styles.connectingWrap} pointerEvents="none">
          <View style={styles.connectingDot} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,10,10,0.55)',
  },
  connectingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: spacing.xxl * 2,
  },
  connectingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.surface,
    opacity: 0.6,
  },
  card: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl + 6,
    borderTopRightRadius: radius.xl + 6,
    paddingHorizontal: spacing.xl,
    paddingTop: 0,
    paddingBottom: spacing.xxl,
    overflow: 'hidden',
    ...shadow.nav,
  },
  progressTrack: {
    height: 4,
    backgroundColor: colors.border,
    width: '100%',
  },
  progressFill: {
    height: '100%',
  },
  badgeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  badge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  badgeText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 0.6,
  },
  timerValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.ink,
    fontVariant: ['tabular-nums'],
  },
  timerValueUrgent: {
    color: colors.danger,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatarWrap: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  avatarText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 17,
  },
  customerName: {
    ...typography.h3,
    color: colors.ink,
    marginBottom: 2,
  },
  metaText: {
    ...typography.caption,
    color: colors.inkMuted,
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.xl,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
  statLabel: {
    ...typography.label,
    color: colors.inkSoft,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: 19,
    fontWeight: '700',
    color: colors.ink,
  },
  statSkeleton: {
    width: 48,
    height: 16,
    borderRadius: radius.sm,
    backgroundColor: colors.border,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  declineButton: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingVertical: spacing.lg - 2,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  declineText: {
    color: colors.inkMuted,
    fontWeight: '700',
    fontSize: 15,
  },
  acceptButton: {
    flex: 2,
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: spacing.lg - 2,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  acceptText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});
