import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';

import TopNav from '../../components/TopNav';
import WelcomeHeader from '../../components/WelcomeHeader';
import LocationLine from '../../components/LocationLine';
import AvailabilityCard from '../../components/AvailabilityCard';
import ActiveJobCard from '../../components/ActiveJobCard';
import PromotionalBannerSlider from '../../components/PromotionalBannerSlider';
import SafetyBanner from '../../components/SafetyBanner';
import BottomNav from '../../components/BottomNav';

export default function WorkerDashboardScreen() {
  return (
    <View style={styles.container}>
      <TopNav />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <WelcomeHeader />
        <LocationLine />
        <AvailabilityCard />
        <ActiveJobCard />
        <PromotionalBannerSlider />
        <SafetyBanner />
      </ScrollView>

      <View style={styles.bottomNavContainer}>
        <BottomNav />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },

  scrollContent: {
    paddingBottom: 100,
  },

  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999,
  },
});