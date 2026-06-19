import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';

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
  const [activeTab, setActiveTab] = useState('Upcoming');

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
      <Text style={styles.heading}>My Jobs</Text>

      <Text style={styles.subHeading}>
        Manage your accepted and upcoming tasks.
      </Text>

      <View style={styles.tabs}>
        {['Today', 'Upcoming', 'All History'].map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[
              styles.tab,
              activeTab === tab && styles.activeTab,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={jobsData}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default MyJobsList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#F8F8F8',
  },

  heading: {
    fontSize: 34,
    fontWeight: '700',
    color: '#212121',
    marginTop: 24,
  },

  subHeading: {
    fontSize: 16,
    color: '#6B6B6B',
    marginTop: 6,
    marginBottom: 24,
  },

  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },

  tab: {
    borderWidth: 1,
    borderColor: '#F27A2D',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },

  activeTab: {
    backgroundColor: '#FF6200',
    borderColor: '#FF6200',
  },

  tabText: {
    color: '#6B4E3D',
    fontWeight: '600',
  },

  activeTabText: {
    color: '#FFFFFF',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginBottom: 18,
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
    padding: 16,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E7E7E7',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#555',
  },

  userInfo: {
    flex: 1,
    marginLeft: 12,
  },

  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212121',
  },

  rating: {
    marginTop: 2,
    color: '#5A4035',
    fontSize: 14,
  },

  tradeBadge: {
    backgroundColor: '#FF6200',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  tradeText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 12,
  },

  infoContainer: {
    paddingHorizontal: 16,
  },

  info: {
    fontSize: 16,
    color: '#6B4E3D',
    marginBottom: 12,
  },

  divider: {
    height: 1,
    backgroundColor: '#E6E6E6',
    marginHorizontal: 16,
    marginTop: 6,
  },

  bottomRow: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  status: {
    color: '#FF6200',
    fontWeight: '700',
    fontSize: 15,
  },

  detailButton: {
    borderWidth: 2,
    borderColor: '#FF6200',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },

  detailText: {
    color: '#FF6200',
    fontWeight: '700',
  },
});