import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import TopAppBar from '../components/TopAppBar';
import Worker from '../../assets/worker.svg';

const Review = () => {
  return (
    <View style={styles.container}>
      <TopAppBar title="Reviews Given" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>Your Feedback History</Text>

        <Text style={styles.desc}>
          Here are the reviews you've left for workers. Your feedback helps
          maintain our high-quality community.
        </Text>

        {/* Review 1 */}
        <View style={styles.reviewCard}>
          <View style={styles.header}>
            <View style={styles.profileSection}>
              <Worker width={50} height={50} />

              <View style={styles.userInfo}>
                <Text style={styles.name}>Sarah J.</Text>
                <Text style={styles.service}>Plumbing Services</Text>
              </View>
            </View>

            <Text style={styles.date}>Oct 24, 2023</Text>
          </View>

          <View style={styles.ratingRow}>
            <Text style={styles.stars}>★★★★★</Text>
            <Text style={styles.rating}>5.0</Text>
          </View>

          <Text style={styles.reviewText}>
            Sarah was incredible! She arrived exactly when she said she would,
            found the leak under the sink immediately, and had it fixed within
            30 minutes. Extremely professional and highly recommended.
          </Text>
        </View>

        {/* Review 2 */}
        <View style={styles.reviewCard}>
          <View style={styles.header}>
            <View style={styles.profileSection}>
              <Worker width={50} height={50} />

              <View style={styles.userInfo}>
                <Text style={styles.name}>Michael R.</Text>
                <Text style={styles.service}>Electrical Repair</Text>
              </View>
            </View>

            <Text style={styles.date}>Oct 20, 2023</Text>
          </View>

          <View style={styles.ratingRow}>
            <Text style={styles.stars}>★★★★★</Text>
            <Text style={styles.rating}>4.8</Text>
          </View>

          <Text style={styles.reviewText}>
            Michael quickly diagnosed the wiring issue and fixed it safely.
            Professional, punctual, and explained everything clearly.
          </Text>
        </View>

        {/* Review 3 */}
        <View style={styles.reviewCard}>
          <View style={styles.header}>
            <View style={styles.profileSection}>
              <Worker width={50} height={50} />

              <View style={styles.userInfo}>
                <Text style={styles.name}>John D.</Text>
                <Text style={styles.service}>Carpentry Work</Text>
              </View>
            </View>

            <Text style={styles.date}>Oct 15, 2023</Text>
          </View>

          <View style={styles.ratingRow}>
            <Text style={styles.stars}>★★★★☆</Text>
            <Text style={styles.rating}>4.5</Text>
          </View>

          <Text style={styles.reviewText}>
            Excellent craftsmanship and attention to detail. The furniture was
            completed on time and exceeded expectations.
          </Text>
        </View>

        {/* Review 4 */}
        <View style={styles.reviewCard}>
          <View style={styles.header}>
            <View style={styles.profileSection}>
              <Worker width={50} height={50} />

              <View style={styles.userInfo}>
                <Text style={styles.name}>David K.</Text>
                <Text style={styles.service}>Painting Services</Text>
              </View>
            </View>

            <Text style={styles.date}>Oct 10, 2023</Text>
          </View>

          <View style={styles.ratingRow}>
            <Text style={styles.stars}>★★★★★</Text>
            <Text style={styles.rating}>5.0</Text>
          </View>

          <Text style={styles.reviewText}>
            Fantastic painting work. Clean finish, great communication, and
            completed the project before the deadline.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default Review;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  scrollContent: {
    paddingBottom: 30,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginTop: 20,
    marginHorizontal: 20,
  },

  desc: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 20,
    marginTop: 8,
    lineHeight: 20,
  },

  reviewCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  userInfo: {
    marginLeft: 12,
  },

  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },

  service: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },

  date: {
    fontSize: 12,
    color: '#666',
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },

  stars: {
    fontSize: 18,
    color: '#FF6B00',
  },

  rating: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
  },

  reviewText: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
  },
});