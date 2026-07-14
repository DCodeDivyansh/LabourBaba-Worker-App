import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { getWorkerBookings } from '../services/booking';
import { colors } from '../theme/theme';

// ─── Helpers ───────────────────────────────────────────────────────────────

const isToday = (dateStr) => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
};

const isUpcoming = (dateStr, status) => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  return d > new Date() && (status === 'confirmed' || status === 'otp_pending' || status === 'OTP_PENDING');
};

const isCompleted = (status) => {
  if (!status) return false;
  const s = status.toLowerCase();
  return s === 'completed' || s === 'done';
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

// ⬅ FIXED: removed duplicate 'otp_pending' condition
const statusConfig = (status) => {
  const s = (status || '').toLowerCase();
  if (s === 'completed' || s === 'done') return { label: 'Completed', color: '#2E7D32', bg: '#E8F5E9' };
  if (s === 'confirmed') return { label: 'Confirmed', color: '#1976D2', bg: '#E3F2FD' };
  if (s === 'in_progress') return { label: 'In Progress', color: colors.primary, bg: '#FFF1E8' };
  if (s === 'otp_pending') return { label: 'OTP Pending', color: '#B45309', bg: '#FFF8E1' };
  if (s === 'cancelled') return { label: 'Cancelled', color: '#C0392B', bg: '#FDECEA' };
  return { label: status || 'Pending', color: '#6B6B6B', bg: '#F2F2F2' };
};

const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('');
};

// ─── Job Card ──────────────────────────────────────────────────────────────

const JobCard = ({ item, onPress }) => {
  const booking = item;
  const customerName = booking.customer?.name || 'Customer';
  const initials = getInitials(customerName);
  const trade = booking.job_requirement?.skill_type || booking.job?.skill_type || '—';
  const earnings = booking.job_requirement?.rate_per_day || booking.job?.budget || null;
  const location = booking.job?.location || '—';
  const dateStr = booking.scheduled_at || booking.created_at;
  const cfg = statusConfig(booking.status);

  return (
    <TouchableOpacity activeOpacity={0.85} style={styles.card} onPress={() => onPress(booking)}>
      {/* Header row */}
      <View style={styles.headerRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.name} numberOfLines={1}>{customerName}</Text>
          {/* ⬅ CHANGED: trade shown once here, star rating standalone */}
          <Text style={styles.rating}>⭐ 4.8 rating</Text>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
          <View style={[styles.statusDot, { backgroundColor: cfg.color }]} />
          <Text style={[styles.statusText, { color: cfg.color }]} numberOfLines={1}>
            {cfg.label}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Info rows */}
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>🔧</Text>
          <Text style={styles.info} numberOfLines={1}>{trade}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>📅</Text>
          <Text style={styles.info} numberOfLines={1}>{formatDate(dateStr)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>📍</Text>
          <Text style={styles.info} numberOfLines={1}>{location}</Text>
        </View>
        {earnings ? (
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>💰</Text>
            <Text style={[styles.info, styles.infoEarnings]}>₹{earnings} / Day</Text>
          </View>
        ) : null}
      </View>

      {/* Bottom row */}
      <View style={styles.bottomRow}>
        <TouchableOpacity
          style={styles.detailButton}
          onPress={() => onPress(booking)}
          activeOpacity={0.8}
        >
          <Text style={styles.detailText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

// ─── Empty State ───────────────────────────────────────────────────────────

const EmptyState = ({ tab }) => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyEmoji}>
      {tab === 'allHistory' ? '📋' : tab === 'today' ? '📅' : '🗓️'}
    </Text>
    <Text style={styles.emptyTitle}>No Jobs Yet</Text>
    <Text style={styles.emptySubtitle}>
      {tab === 'allHistory'
        ? 'Your completed jobs will appear here.'
        : tab === 'today'
          ? 'No jobs scheduled for today.'
          : 'No upcoming jobs at the moment.'}
    </Text>
  </View>
);

// ─── Main Component ────────────────────────────────────────────────────────

const MyJobsList = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [activeTab, setActiveTab] = useState('allHistory');
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const response = await getWorkerBookings();
      const list = response?.data || [];
      setAllBookings(list);
    } catch (err) {
      console.log('[MyJobsList] fetch error:', err?.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchBookings();
    }, [fetchBookings]),
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings(true);
  };

  const filteredData = allBookings.filter((b) => {
    if (activeTab === 'today') return isToday(b.scheduled_at || b.created_at);
    if (activeTab === 'upcoming') return isUpcoming(b.scheduled_at, b.status);
    if (activeTab === 'allHistory') return true;
    return true;
  });

  const sorted = [...filteredData].sort(
    (a, b) =>
      new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime(),
  );

  // ⬅ FIXED: both branches were identical dead code — simplified to one call
  const handleCardPress = (booking) => {
    navigation.navigate('JobDetails', { booking, bookingId: booking.id });
  };

  const tabs = [
    { key: 'today', label: t('jobs.myJobsList.tabs.today') },
    { key: 'upcoming', label: t('jobs.myJobsList.tabs.upcoming') },
    { key: 'allHistory', label: t('jobs.myJobsList.tabs.allHistory') },
  ];

  const completedCount = allBookings.filter(b => isCompleted(b.status)).length;
  const activeCount = allBookings.filter(b =>
    ['confirmed', 'in_progress', 'otp_pending', 'OTP_PENDING', 'IN_PROGRESS'].includes(b.status)
  ).length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.heading}>{t('jobs.myJobsList.heading')}</Text>
      <Text style={styles.subHeading}>{t('jobs.myJobsList.subHeading')}</Text>

      {/* Stats bar */}
      {!loading && (
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{completedCount}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={[styles.statBox, styles.statBoxMid]}>
            <Text style={styles.statNum}>{activeCount}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{allBookings.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>
      )}

      {/* Tabs */}
      <View style={styles.tabs}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            activeOpacity={0.8}
          >
            <Text
              style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}
              numberOfLines={1}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={sorted}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          renderItem={({ item }) => <JobCard item={item} onPress={handleCardPress} />}
          ListEmptyComponent={<EmptyState tab={activeTab} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        />
      )}
    </View>
  );
};

export default MyJobsList;

// ⬅ CHANGED: every dimension below is now a fixed dp value instead of
// width*/height* scaling. RN's dp unit already accounts for screen density,
// so scaling off raw window width made phones and tablets look inconsistent
// (huge text on tablets, cramped text on small phones). Fixed values render
// the same relative proportions across devices.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#F9F8F7',
  },

  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E1E1E',
    marginTop: 20,
  },

  subHeading: {
    fontSize: 14,
    color: '#8A7A72',
    marginTop: 4,
    marginBottom: 18,
  },

  // ── Stats bar ─────────────────────────────────────────────────────────────
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EDE7E2',
    marginBottom: 18,
    overflow: 'hidden',
  },

  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
  },

  statBoxMid: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#EDE7E2',
  },

  statNum: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
  },

  statLabel: {
    fontSize: 11,
    color: '#8A7A72',
    fontWeight: '600',
    marginTop: 3,
  },

  // ── Tabs ──────────────────────────────────────────────────────────────────
  tabs: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },

  tab: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#EDE7E2',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  activeTab: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  tabText: {
    color: '#5A463F',
    fontWeight: '600',
    fontSize: 13,
  },

  activeTabText: {
    color: '#FFFFFF',
  },

  listContent: {
    paddingBottom: 24,
  },

  // ── Card ──────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginBottom: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EDE7E2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF1E8',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.primary,
  },

  userInfo: {
    flex: 1,
    marginLeft: 12,
    minWidth: 0,
  },

  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E1E1E',
  },

  rating: {
    marginTop: 2,
    color: '#8A7A72',
    fontSize: 12,
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    flexShrink: 0,
    marginLeft: 8,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },

  statusText: {
    fontWeight: '700',
    fontSize: 11,
  },

  divider: {
    height: 1,
    backgroundColor: '#F0EBE7',
    marginVertical: 14,
  },

  infoContainer: {
    gap: 8,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoIcon: {
    fontSize: 14,
    width: 22,
  },

  info: {
    fontSize: 14,
    color: '#3A3A3A',
    fontWeight: '500',
    flex: 1,
  },

  infoEarnings: {
    color: colors.primary,
    fontWeight: '700',
  },

  bottomRow: {
    marginTop: 14,
  },

  detailButton: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 22,
    paddingVertical: 11,
    alignItems: 'center',
  },

  detailText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },

  // ── Loading / Empty ───────────────────────────────────────────────────────
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },

  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 32,
  },

  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E1E1E',
    marginBottom: 6,
  },

  emptySubtitle: {
    fontSize: 14,
    color: '#8A7A72',
    textAlign: 'center',
    lineHeight: 20,
  },
});