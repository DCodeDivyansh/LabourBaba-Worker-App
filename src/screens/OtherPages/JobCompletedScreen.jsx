import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
  Image,
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import TopAppBar from '../../components/TopAppBar';
import TickIcon from '../../../assets/TickIcon.svg';
import MoneyIcon from '../../../assets/MoneyIcon.svg';
import CalenderIcon from '../../../assets/CalenderIcon.svg';
import LocationIcon from '../../../assets/Location.svg';

const JobCompletedScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const { booking } = route.params || {};

  // ── Animations ───────────────────────────────────────────────────────────
  const checkScale = useRef(new Animated.Value(0)).current;
  const checkOpacity = useRef(new Animated.Value(0)).current;
  const cardSlide = useRef(new Animated.Value(40)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const confettiScale = useRef(new Animated.Value(0.5)).current;
  const confettiOpacity = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Staggered entrance animations
    Animated.sequence([
      // 1. Checkmark bounces in
      Animated.parallel([
        Animated.spring(checkScale, {
          toValue: 1,
          friction: 4,
          tension: 60,
          useNativeDriver: true,
        }),
        Animated.timing(checkOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      // 2. Confetti burst
      Animated.parallel([
        Animated.spring(confettiScale, {
          toValue: 1,
          friction: 5,
          tension: 50,
          useNativeDriver: true,
        }),
        Animated.timing(confettiOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      // 3. Card slides up
      Animated.parallel([
        Animated.timing(cardSlide, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Gentle continuous pulse on checkmark ring
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();

    return () => pulse.stop();
  }, []);

  // ── Derived data ─────────────────────────────────────────────────────────
  const customerName = booking?.customer?.name || t('jobs.incomingJob.customerFallback', 'Customer');
  const jobIdShort = booking?.id ? booking.id.substring(0, 8).toUpperCase() : 'LB-0000';
  const earnings = booking?.job_requirement?.rate_per_day || booking?.job?.budget || '1,200';
  const jobLocation = booking?.job?.location || t('jobs.jobDetails.serviceAddress');
  const completedDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const completedTime = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  // ── Actions ──────────────────────────────────────────────────────────────
  const handleGoHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
  };

  const handleViewHistory = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
  };

  return (
    <View style={styles.container}>
      <TopAppBar
        title={t('jobs.jobCompleted.screenTitle', 'Job Completed')}
        showBackButton={false}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Success Hero ─────────────────────────────────────────────── */}
        <View style={styles.heroSection}>
          {/* Confetti burst ring */}
          <Animated.View
            style={[
              styles.confettiRing,
              {
                transform: [{ scale: Animated.multiply(confettiScale, pulseAnim) }],
                opacity: confettiOpacity,
              },
            ]}
          />

          {/* Green check circle */}
          <Animated.View
            style={[
              styles.checkCircle,
              {
                transform: [{ scale: checkScale }],
                opacity: checkOpacity,
              },
            ]}
          >
            <TickIcon width={36} height={36} />
          </Animated.View>

          <Text style={styles.heroTitle}>
            {t('jobs.jobCompleted.congratulations', 'Congratulations!')}
          </Text>

          <Text style={styles.heroSubtitle}>
            {t('jobs.jobCompleted.successMessage', 'You have successfully completed this job')}
          </Text>
        </View>

        {/* ── Earnings Card ────────────────────────────────────────────── */}
        <Animated.View
          style={[
            styles.earningsCard,
            {
              transform: [{ translateY: cardSlide }],
              opacity: cardOpacity,
            },
          ]}
        >
          <Text style={styles.earningsLabel}>
            {t('jobs.jobCompleted.totalEarnings', 'TOTAL EARNINGS')}
          </Text>
          <Text style={styles.earningsAmount}>₹{earnings}</Text>
          <View style={styles.earningsBadge}>
            <MoneyIcon width={14} height={14} />
            <Text style={styles.earningsBadgeText}>
              {t('jobs.jobDetails.cashOnCompletion', 'Cash on Completion')}
            </Text>
          </View>
        </Animated.View>

        {/* ── Job Summary Card ─────────────────────────────────────────── */}
        <Animated.View
          style={[
            styles.summaryCard,
            {
              transform: [{ translateY: cardSlide }],
              opacity: cardOpacity,
            },
          ]}
        >
          <Text style={styles.summaryTitle}>
            {t('jobs.jobCompleted.jobSummary', 'Job Summary')}
          </Text>

          {/* Job ID */}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              {t('jobs.jobCompleted.jobId', 'Job ID')}
            </Text>
            <Text style={styles.summaryValue}>#{jobIdShort}</Text>
          </View>

          <View style={styles.divider} />

          {/* Customer */}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              {t('jobs.jobCompleted.customer', 'Customer')}
            </Text>
            <View style={styles.customerRow}>
              <Image
                source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
                style={styles.miniAvatar}
              />
              <Text style={styles.summaryValue}>{customerName}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Location */}
          <View style={styles.summaryRow}>
            <View style={styles.summaryLabelRow}>
              <LocationIcon width={14} height={14} />
              <Text style={[styles.summaryLabel, { marginLeft: 6 }]}>
                {t('jobs.jobCompleted.location', 'Location')}
              </Text>
            </View>
            <Text style={[styles.summaryValue, styles.locationValue]} numberOfLines={2}>
              {jobLocation}
            </Text>
          </View>

          <View style={styles.divider} />

          {/* Completed On */}
          <View style={styles.summaryRow}>
            <View style={styles.summaryLabelRow}>
              <CalenderIcon width={14} height={14} />
              <Text style={[styles.summaryLabel, { marginLeft: 6 }]}>
                {t('jobs.jobCompleted.completedOn', 'Completed On')}
              </Text>
            </View>
            <Text style={styles.summaryValue}>
              {completedDate}, {completedTime}
            </Text>
          </View>

          <View style={styles.divider} />

          {/* Payment */}
          <View style={styles.summaryRow}>
            <View style={styles.summaryLabelRow}>
              <MoneyIcon width={14} height={14} />
              <Text style={[styles.summaryLabel, { marginLeft: 6 }]}>
                {t('jobs.jobCompleted.payment', 'Payment')}
              </Text>
            </View>
            <Text style={[styles.summaryValue, styles.paymentValue]}>₹{earnings}</Text>
          </View>
        </Animated.View>

        {/* ── Rating Prompt Card ───────────────────────────────────────── */}
        <Animated.View
          style={[
            styles.ratingCard,
            {
              transform: [{ translateY: cardSlide }],
              opacity: cardOpacity,
            },
          ]}
        >
          <Text style={styles.ratingTitle}>
            {t('jobs.jobCompleted.rateExperience', 'How was your experience?')}
          </Text>
          <Text style={styles.ratingSubtitle}>
            {t('jobs.jobCompleted.rateExperienceDesc', 'Your feedback helps us improve the platform for everyone.')}
          </Text>

          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} style={styles.starBtn} activeOpacity={0.7}>
                <Text style={styles.starEmoji}>⭐</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* ── Motivational Message ─────────────────────────────────────── */}
        <Animated.View
          style={[
            styles.motivationCard,
            {
              transform: [{ translateY: cardSlide }],
              opacity: cardOpacity,
            },
          ]}
        >
          <Text style={styles.motivationEmoji}>🎯</Text>
          <Text style={styles.motivationTitle}>
            {t('jobs.jobCompleted.keepItUp', 'Keep Up the Great Work!')}
          </Text>
          <Text style={styles.motivationSubtitle}>
            {t('jobs.jobCompleted.keepItUpDesc', 'Complete more jobs to unlock bonuses and boost your profile visibility.')}
          </Text>
        </Animated.View>
      </ScrollView>

      {/* ── Bottom Actions ───────────────────────────────────────────── */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.homeBtn} onPress={handleGoHome} activeOpacity={0.85}>
          <Text style={styles.homeBtnText}>
            {t('jobs.jobCompleted.backToHome', 'Back to Home')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.historyBtn} onPress={handleViewHistory} activeOpacity={0.7}>
          <Text style={styles.historyBtnText}>
            {t('jobs.jobCompleted.viewJobHistory', 'View Job History')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default JobCompletedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },

  scrollContent: {
    paddingBottom: 140,
  },

  /* ── Hero Section ───────────────────────────────────────────────────── */
  heroSection: {
    alignItems: 'center',
    paddingTop: 36,
    paddingBottom: 28,
    paddingHorizontal: 24,
  },

  confettiRing: {
    position: 'absolute',
    top: 16,
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: 'rgba(76, 175, 80, 0.18)',
    borderStyle: 'dashed',
  },

  checkCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
    marginBottom: 20,
  },

  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 8,
  },

  heroSubtitle: {
    fontSize: 16,
    color: '#6B6B6B',
    textAlign: 'center',
    lineHeight: 22,
  },

  /* ── Earnings Card ──────────────────────────────────────────────────── */
  earningsCard: {
    marginHorizontal: 16,
    backgroundColor: '#FFF5EE',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#FFD7C2',
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },

  earningsLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF7A2E',
    letterSpacing: 1,
    marginBottom: 8,
  },

  earningsAmount: {
    fontSize: 40,
    fontWeight: '800',
    color: '#FF5A00',
    marginBottom: 12,
  },

  earningsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFE0CC',
  },

  earningsBadgeText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '600',
    color: '#FF7A2E',
  },

  /* ── Summary Card ───────────────────────────────────────────────────── */
  summaryCard: {
    marginHorizontal: 16,
    backgroundColor: '#FFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },

  summaryLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  summaryLabel: {
    fontSize: 14,
    color: '#8A8A8A',
    fontWeight: '500',
  },

  summaryValue: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '600',
    maxWidth: '55%',
    textAlign: 'right',
  },

  locationValue: {
    fontSize: 13,
    lineHeight: 18,
  },

  paymentValue: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '800',
  },

  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  miniAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },

  divider: {
    height: 1,
    backgroundColor: '#F5F5F5',
    marginVertical: 10,
  },

  /* ── Rating Card ────────────────────────────────────────────────────── */
  ratingCard: {
    marginHorizontal: 16,
    backgroundColor: '#FFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  ratingTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 6,
  },

  ratingSubtitle: {
    fontSize: 13,
    color: '#8A8A8A',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },

  starsRow: {
    flexDirection: 'row',
    gap: 12,
  },

  starBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF8F0',
    borderWidth: 1,
    borderColor: '#FFE0CC',
    justifyContent: 'center',
    alignItems: 'center',
  },

  starEmoji: {
    fontSize: 22,
  },

  /* ── Motivation Card ────────────────────────────────────────────────── */
  motivationCard: {
    marginHorizontal: 16,
    backgroundColor: '#F0FFF0',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D4F5D4',
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },

  motivationEmoji: {
    fontSize: 32,
    marginBottom: 10,
  },

  motivationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 6,
  },

  motivationSubtitle: {
    fontSize: 13,
    color: '#558B2F',
    textAlign: 'center',
    lineHeight: 18,
  },

  /* ── Bottom Actions ─────────────────────────────────────────────────── */
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderColor: '#EEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 10,
  },

  homeBtn: {
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF5A00',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF5A00',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },

  homeBtnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  historyBtn: {
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1.5,
    borderColor: '#FF5A00',
  },

  historyBtnText: {
    color: '#FF5A00',
    fontSize: 16,
    fontWeight: '600',
  },
});
