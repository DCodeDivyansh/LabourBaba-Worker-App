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
import {
  checkNotificationPermissionStatus,
  requestNotificationPermission,
  getFCMToken,
} from '../../services/firebase';
import { updateDeviceToken } from '../../services/worker';

export default function WorkerDashboardScreen() {
  const [worker, setWorker] = useState(null);
  const { isOnline, setIsOnline } = useOnlineStatus();
  const [address, setAddress] = useState('');

  useEffect(() => {
    loadWorker();
    ensureNotificationPermission(); // ⬅ NEW: prompt for notifications right on the dashboard
  }, []);
  // NOTE: job:incoming is now handled globally by IncomingJobListener
  // (mounted in App.tsx) so the popup opens no matter which screen the
  // worker is on. No local listener needed here anymore.

  // ⬅ NEW: fires the native OS permission dialog directly (no in-app
  // explainer screen) if notifications aren't already on. If the worker
  // grants it, grabs the FCM token and registers it with the backend right
  // away so job alerts start working immediately.
  const ensureNotificationPermission = async () => {
    try {
      const status = await checkNotificationPermissionStatus();
      if (status === 'granted') return;

      const result = await requestNotificationPermission();
      if (result === 'granted') {
        const token = await getFCMToken();
        const authToken = await AsyncStorage.getItem('token');
        if (token && authToken) {
          await updateDeviceToken(token);
        }
      }
    } catch (err) {
      console.log('[WorkerDashboardScreen] Notification permission check failed:', err);
    }
  };

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