import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';

import { useTranslation } from 'react-i18next';

const { width, height } = Dimensions.get('window');

const jobsData = [
  {
    id: '1',
    initials: 'RP',
    name: 'Rajesh Patel',
    rating: '4.9',
    trade: 'Plumbing',
    date: 'Tomorrow, 09:00 AM',
    location: '12B, Sunrise Apartments, Andheri...',
    status: 'Upcoming',
  },
  {
    id: '2',
    initials: 'SM',
    name: 'Sunita Menon',
    rating: '4.7',
    trade: 'Electrical',
    date: 'Oct 24, 02:30 PM',
    location: 'Bungalow 4, Palm Grove, Bandra',
    status: 'Upcoming',
  },
  {
    id: '3',
    initials: 'AK',
    name: 'Amit Kumar',
    rating: '5.0',
    trade: 'Carpentry',
    date: 'Oct 26, 10:00 AM',
    location: 'Shop 12, Main Market Road, Dadar',
    status: 'Upcoming',
  },
];

const MyJobsList = () => {

  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('All History');

  const tabs = [
    {
      key: 'today',
      label: t('jobs.myJobsList.tabs.today'),
    },
    {
      key: 'upcoming',
      label: t('jobs.myJobsList.tabs.upcoming'),
    },
    {
      key: 'allHistory',
      label: t('jobs.myJobsList.tabs.allHistory'),
    },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.topBorder} />

      <View style={styles.headerRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.initials}</Text>
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.rating}>★ {item.rating} Client</Text>
        </View>

        <View style={styles.tradeBadge}>
          <Text style={styles.tradeText}>{item.trade}</Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.info}>📅 {item.date}</Text>
        <Text style={styles.info}>📍 {item.location}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.bottomRow}>
        <Text style={styles.status}>🕒 {item.status}</Text>

        <TouchableOpacity style={styles.detailButton}>
          <Text style={styles.detailText}>Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{t('jobs.myJobsList.heading')}</Text>

      <Text style={styles.subHeading}>
        {t('jobs.myJobsList.subHeading')}
      </Text>

      <View style={styles.tabs}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            style={[
              styles.tab,
              activeTab === tab.key &&
              styles.activeTab,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key &&
                styles.activeTabText,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={jobsData}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: height * 0.03,
        }}
      />
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
    marginBottom: height * 0.03,
  },

  tabs: {
    flexDirection: 'row',
    marginBottom: height * 0.03,
  },

  tab: {
    flex: 1,
    marginHorizontal: 4,

    borderWidth: 1,
    borderColor: '#F27A2D',

    borderRadius: width * 0.06,

    paddingVertical: height * 0.015,

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
    fontSize: width * 0.032,
  },

  activeTabText: {
    color: '#FFFFFF',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: width * 0.045,
    marginBottom: height * 0.02,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0D1C0',
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
    width: width * 0.13,
    height: width * 0.13,
    borderRadius: width * 0.065,

    backgroundColor: '#E7E7E7',

    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    fontSize: width * 0.05,
    fontWeight: '700',
    color: '#555',
  },

  userInfo: {
    flex: 1,
    marginLeft: width * 0.03,
  },

  name: {
    fontSize: width * 0.05,
    fontWeight: '700',
    color: '#212121',
  },

  rating: {
    marginTop: 2,
    color: '#5A4035',
    fontSize: width * 0.034,
  },

  tradeBadge: {
    backgroundColor: '#FF6200',
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.008,
    borderRadius: width * 0.02,
  },

  tradeText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: width * 0.03,
  },

  infoContainer: {
    paddingHorizontal: width * 0.04,
  },

  info: {
    fontSize: width * 0.038,
    color: '#6B4E3D',
    marginBottom: height * 0.012,
  },

  divider: {
    height: 1,
    backgroundColor: '#E6E6E6',
    marginHorizontal: width * 0.04,
    marginTop: height * 0.006,
  },

  bottomRow: {
    padding: width * 0.04,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  status: {
    color: '#FF6200',
    fontWeight: '700',
    fontSize: width * 0.036,
  },

  detailButton: {
    borderWidth: 2,
    borderColor: '#FF6200',

    borderRadius: width * 0.06,

    paddingHorizontal: width * 0.06,
    paddingVertical: height * 0.012,
  },

  detailText: {
    color: '#FF6200',
    fontWeight: '700',
    fontSize: width * 0.035,
  },
});