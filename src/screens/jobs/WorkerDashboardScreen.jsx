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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useOnlineStatus } from '../../api/OnlineStatusContext';
import { socket } from "../../services/socket";

export default function WorkerDashboardScreen() {
  const [worker, setWorker] = useState(null);
  const { isOnline, setIsOnline } = useOnlineStatus();
  const [address, setAddress] = useState('');

  useEffect(() => {
    loadWorker();
  }, []);
  useEffect(() => {
    const handleIncomingJob = (job) => {
      console.log("========== NEW JOB ==========");
      console.log(job);
      console.log("=============================");
    };

    socket.on("job:incoming", handleIncomingJob);

    return () => {
      socket.off("job:incoming", handleIncomingJob);
    };
  }, []);

  const loadWorker = async () => {
    try {
      const cached = await AsyncStorage.getItem("worker");

      if (cached) {
        const parsedWorker = JSON.parse(cached);
        setWorker(parsedWorker);
        console.log(parsedWorker);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <TopNav />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <WelcomeHeader
          name={worker?.name}
        />

        <LocationLine location={address} />
        <AvailabilityCard setAddress={setAddress} />
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