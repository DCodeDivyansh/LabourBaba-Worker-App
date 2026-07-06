import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';

import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { getWorkerBookings } from '../services/booking';

const { width, height } = Dimensions.get('window');

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

const statusConfig = (status) => {
  const s = (status || '').toLowerCase();
  if (s === 'completed' || s === 'done') return { label: '✓ Completed', color: '#4CAF50', bg: '#E8F5E9' };
  if (s === 'confirmed') return { label: '✓ Confirmed', color: '#1976D2', bg: '#E3F2FD' };
  if (s === 'in_progress') return { label: '⚡ In Progress', color: '#FF6200', bg: '#FFF3E0' };
  if (s === 'otp_pending' || s === 'otp_pending') return { label: '🔑 OTP Pending', color: '#F57C00', bg: '#FFF8E1' };
  if (s === 'cancelled') return { label: '✕ Cancelled', color: '#D32F2F', bg: '#FFEBEE' };
  return { label: status || 'Pending', color: '#888', bg: '#F5F5F5' };
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
      <View style={styles.topBorder} />

      {/* Header row */}
      <View style={styles.headerRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.name} numberOfLines={1}>{customerName}</Text>
          <Text style={styles.rating}>⭐ 4.8 • {trade}</Text>
        </View>

        <View style={[styles.tradeBadge, { backgroundColor: cfg.bg, borderColor: cfg.color }]}>
          <Text style={[styles.tradeText, { color: cfg.color }]}>{trade}</Text>
        </View>
      </View>

      {/* Info rows */}
      <View style={styles.infoContainer}>
        <Text style={styles.info}>📅 {formatDate(dateStr)}</Text>
        <Text style={styles.info} numberOfLines={1}>📍 {location}</Text>
        {earnings && (
          <Text style={styles.info}>💰 ₹{earnings} / Day</Text>
        )}
      </View>

      <View style={styles.divider} />

      {/* Bottom row */}
      <View style={styles.bottomRow}>
        <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
          <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
        </View>

        <TouchableOpacity style={styles.detailButton} onPress={() => onPress(booking)}>
          <Text style={styles.detailText}>Details →</Text>
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

  // Refresh every time this tab screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchBookings();
    }, [fetchBookings]),
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings(true);
  };

  // ── Tab filter ───────────────────────────────────────────────────────────
  const filteredData = allBookings.filter((b) => {
    if (activeTab === 'today') return isToday(b.scheduled_at || b.created_at);
    if (activeTab === 'upcoming') return isUpcoming(b.scheduled_at, b.status);
    if (activeTab === 'allHistory') return true; // show everything
    return true;
  });

  // Sort: most recent first
  const sorted = [...filteredData].sort(
    (a, b) =>
      new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime(),
  );

  const handleCardPress = (booking) => {
    const isActive =
      ['confirmed', 'in_progress', 'otp_pending', 'OTP_PENDING', 'IN_PROGRESS'].includes(
        booking.status,
      );
    if (isActive) {
      navigation.navigate('JobDetails', { booking, bookingId: booking.id });
    } else {
      navigation.navigate('JobDetails', { booking, bookingId: booking.id });
    }
  };

  const tabs = [
    { key: 'today', label: t('jobs.myJobsList.tabs.today') },
    { key: 'upcoming', label: t('jobs.myJobsList.tabs.upcoming') },
    { key: 'allHistory', label: t('jobs.myJobsList.tabs.allHistory') },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.heading}>{t('jobs.myJobsList.heading')}</Text>
      <Text style={styles.subHeading}>{t('jobs.myJobsList.subHeading')}</Text>

      {/* Stats bar */}
      {!loading && (
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>
              {allBookings.filter(b => isCompleted(b.status)).length}
            </Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={[styles.statBox, styles.statBoxMid]}>
            <Text style={styles.statNum}>
              {allBookings.filter(b => ['confirmed','in_progress','otp_pending','OTP_PENDING','IN_PROGRESS'].includes(b.status)).length}
            </Text>
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
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6200" />
        </View>
      ) : (
        <FlatList
          data={sorted}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          renderItem={({ item }) => <JobCard item={item} onPress={handleCardPress} />}
          ListEmptyComponent={<EmptyState tab={activeTab} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: height * 0.03 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#FF6200']}
              tintColor="#FF6200"
            />
          }
        />
      )}
    </View>
  );
};

export default MyJobsList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    backgroundColor: '#F8F8F8',
  },

  heading: {
    fontSize: width * 0.08,
    fontWeight: '700',
    color: '#212121',
    marginTop: height * 0.03,
  },

  subHeading: {
    fontSize: width * 0.04,
    color: '#6B6B6B',
    marginTop: height * 0.008,
    marginBottom: height * 0.02,
  },

  // ── Stats bar ─────────────────────────────────────────────────────────────
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0D1C0',
    marginBottom: height * 0.02,
    overflow: 'hidden',
  },

  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },

  statBoxMid: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#F0D1C0',
  },

  statNum: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FF6200',
  },

  statLabel: {
    fontSize: 11,
    color: '#888',
    fontWeight: '600',
    marginTop: 2,
  },

  // ── Tabs ──────────────────────────────────────────────────────────────────
  tabs: {
    flexDirection: 'row',
    marginBottom: height * 0.02,
  },

  tab: {
    flex: 1,
    marginHorizontal: 3,
    borderWidth: 1,
    borderColor: '#F27A2D',
    borderRadius: width * 0.06,
    paddingVertical: height * 0.013,
    alignItems: 'center',
    justifyContent: 'center',
  },

  activeTab: {
    backgroundColor: '#FF6200',
    borderColor: '#FF6200',
  },

  tabText: {
    color: '#6B4E3D',
    fontWeight: '600',
    fontSize: width * 0.03,
  },

  activeTabText: {
    color: '#FFFFFF',
  },

  // ── Card ──────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: width * 0.045,
    marginBottom: height * 0.02,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0D1C0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
  },

  topBorder: {
    height: 4,
    backgroundColor: '#FF6200',
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: width * 0.04,
  },

  avatar: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,
    backgroundColor: '#FFE0CC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF6200',
  },

  avatarText: {
    fontSize: width * 0.045,
    fontWeight: '700',
    color: '#FF6200',
  },

  userInfo: {
    flex: 1,
    marginLeft: width * 0.03,
  },

  name: {
    fontSize: width * 0.045,
    fontWeight: '700',
    color: '#212121',
  },

  rating: {
    marginTop: 2,
    color: '#5A4035',
    fontSize: width * 0.033,
  },

  tradeBadge: {
    paddingHorizontal: width * 0.025,
    paddingVertical: 5,
    borderRadius: width * 0.02,
    borderWidth: 1,
  },

  tradeText: {
    fontWeight: '700',
    fontSize: width * 0.028,
  },

  infoContainer: {
    paddingHorizontal: width * 0.04,
    paddingBottom: 4,
  },

  info: {
    fontSize: width * 0.036,
    color: '#6B4E3D',
    marginBottom: height * 0.008,
  },

  divider: {
    height: 1,
    backgroundColor: '#E6E6E6',
    marginHorizontal: width * 0.04,
    marginTop: 4,
  },

  bottomRow: {
    padding: width * 0.04,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },

  statusText: {
    fontWeight: '700',
    fontSize: width * 0.032,
  },

  detailButton: {
    borderWidth: 2,
    borderColor: '#FF6200',
    borderRadius: width * 0.06,
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.01,
  },

  detailText: {
    color: '#FF6200',
    fontWeight: '700',
    fontSize: width * 0.034,
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
    fontSize: 52,
    marginBottom: 16,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },

  emptySubtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
  },
});