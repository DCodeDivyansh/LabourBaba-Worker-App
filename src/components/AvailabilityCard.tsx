import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from 'react-native';

import AvailabilityIcon from '../../assets/Avaliable.svg';
import { updateOnlineStatus } from '../services/workerOnline';
import { useOnlineStatus } from '../api/OnlineStatusContext';
import { getCurrentLocation } from '../services/location';
import { updateWorkerLocation } from '../services/workerLocation';
import { getAddressFromCoordinates } from '../services/reverseGeocode';
import { useTranslation } from 'react-i18next';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { socket } from "../services/socket";

interface Props {
  setAddress: (address: string) => void;
}

const AvailabilityCard = ({ setAddress }: Props) => {
  const { isOnline, setIsOnline } = useOnlineStatus();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const thumbAnim = useRef(new Animated.Value(isOnline ? 1 : 0)).current; // ⬅ NEW

  // ⬅ NEW: animate the toggle thumb whenever isOnline changes
  useEffect(() => {
    Animated.timing(thumbAnim, {
      toValue: isOnline ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isOnline, thumbAnim]);

  const thumbTranslate = thumbAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22],
  });

  const handleToggle = async () => {
    if (loading) return;

    const newStatus = !isOnline;

    try {
      setLoading(true);

      const workerString = await AsyncStorage.getItem("worker");

      if (!workerString) {
        return;
      }

      const worker = JSON.parse(workerString);

      if (newStatus) {
        if (!socket.connected) {
          socket.connect();

          await new Promise<void>((resolve) => {
            socket.on("connect", () => {
              console.log("Socket Connected:", socket.id);
              socket.emit("join:worker", worker.id);
              console.log("Joined worker room:", worker.id);
              resolve();
            });
          });
        } else {
          socket.emit("join:worker", worker.id);
        }

        const { latitude, longitude } = await getCurrentLocation();
        await updateWorkerLocation(latitude, longitude);
        const address = await getAddressFromCoordinates(latitude, longitude);
        setAddress(address);
      }

      const response = await updateOnlineStatus(newStatus);

      if (response.success) {
        setIsOnline(response.data.is_online);

        if (!newStatus && socket.connected) {
          socket.disconnect();
          console.log("Socket Disconnected");
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ⬅ FIXED: title now actually reflects online/offline, not just loading state
  const title = loading
    ? t('dashboard.availability.goingOnline')
    : isOnline
      ? t('dashboard.availability.availableNow')
      : t('dashboard.availability.offlineTitle', "You're Offline");

  const subtitle = isOnline
    ? t('dashboard.availability.subtitle')
    : t('dashboard.availability.offlineSubtitle', 'Turn on to start receiving job requests');

  return (
    <View style={styles.card}>
      <View style={styles.leftContainer}>
        <View style={styles.iconBadge}>
          <AvailabilityIcon width={20} height={20} />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.toggleTrack, isOnline && styles.toggleTrackOn]}
        onPress={handleToggle}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FF6200" style={styles.loader} />
        ) : (
          <Animated.View
            style={[
              styles.thumb,
              { transform: [{ translateX: thumbTranslate }] },
            ]}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default AvailabilityCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EDE7E2',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 16,
    paddingVertical: 16,
    marginHorizontal: 16,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF6200',
    justifyContent: 'center',
    alignItems: 'center',
  },

  textContainer: {
    marginLeft: 12,
    flex: 1,
  },

  title: {
    color: '#1E1E1E',
    fontSize: 16,
    fontWeight: '700',
  },

  subtitle: {
    color: '#8A7A72',
    fontSize: 13,
    marginTop: 3,
    lineHeight: 17,
  },

  toggleTrack: {
    width: 52,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#EDEDED',
    justifyContent: 'center',
  },

  toggleTrackOn: {
    backgroundColor: '#FFDAC2',
  },

  thumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FF6200',
  },

  loader: {
    alignSelf: 'center',
  },
});