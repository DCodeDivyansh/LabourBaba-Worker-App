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
import { getWorkerProfile } from '../../services/workerprofile';
import { useEffect, useState } from 'react';

export default function WorkerDashboardScreen() {
  const [worker, setWorker] = useState(null);

  useEffect(() => {
    loadWorker();
  }, []);

  const loadWorker = async () => {
    try {
      const response = await getWorkerProfile();
      console.log(response);
      setWorker(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  console.log(getWorkerProfile);
  console.log(worker);
  console.log(worker?.name);

  return (
    <View style={styles.container}>
      <TopNav />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <WelcomeHeader
          name={worker?.name}
          imageUrl={worker?.image}
        />

        <LocationLine />
        <AvailabilityCard />
        <ActiveJobCard />
        <PromotionalBannerSlider />
        <SafetyBanner />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F8F7',
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