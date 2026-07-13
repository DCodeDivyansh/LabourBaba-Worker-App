import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Alert, // ⬅ NEW
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

// ⬅ NEW: waits for 'connect' with a hard timeout so a failed connection
// attempt can never hang the toggle forever. Uses `once` for both success
// and failure paths so no listeners accumulate across repeated toggles.
const connectSocket = (timeoutMs = 8000): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (socket.connected) {
      resolve();
      return;
    }

    const timer = setTimeout(() => {
      socket.off('connect', onConnect);
      socket.off('connect_error', onError);
      reject(new Error('Connection timed out'));
    }, timeoutMs);

    const onConnect = () => {
      clearTimeout(timer);
      socket.off('connect_error', onError);
      resolve();
    };

    const onError = (err: any) => {
      clearTimeout(timer);
      socket.off('connect', onConnect);
      reject(err instanceof Error ? err : new Error('Connection failed'));
    };

    socket.once('connect', onConnect);
    socket.once('connect_error', onError);
    socket.connect();
  });
};

const AvailabilityCard = ({ setAddress }: Props) => {
  const { isOnline, setIsOnline } = useOnlineStatus();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const thumbAnim = useRef(new Animated.Value(isOnline ? 1 : 0)).current;

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
      if (!workerString) return;
      const worker = JSON.parse(workerString);

      if (newStatus) {
        // ⬅ CHANGED: timeout-guarded, no leaked listeners, no hang on
        // failure. Room-joining itself now also happens automatically via
        // socket.ts's persistent 'connect' handler — this emit here is just
        // for the (already-connected) fast path.
        try {
          if (!socket.connected) {
            await connectSocket();
          }
          socket.emit("join:worker", worker.id);
        } catch (connErr) {
          console.log('[AvailabilityCard] Socket connect failed:', connErr);
          Alert.alert(
            "Connection Problem",
            "Couldn't connect to the live job feed. Check your internet connection and try again."
          );
          return; // ⬅ don't proceed to mark online if we can't even connect
        }

        try {
          const { latitude, longitude } = await getCurrentLocation();
          await updateWorkerLocation(latitude, longitude);
          const address = await getAddressFromCoordinates(latitude, longitude);
          setAddress(address);
        } catch (locErr) {
          console.log('[AvailabilityCard] Location error:', locErr);
          Alert.alert(
            "Location Needed",
            "We couldn't get your location. Please enable location services and try again."
          );
          return; // ⬅ don't mark online without a location — matching jobs need it
        }
      }

      const response = await updateOnlineStatus(newStatus);

      if (response.success) {
        setIsOnline(response.data.is_online);

        if (!newStatus && socket.connected) {
          socket.disconnect();
          console.log("Socket Disconnected");
        }
      } else {
        Alert.alert("Something Went Wrong", "Couldn't update your availability. Please try again.");
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Something Went Wrong", "Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
            style={[styles.thumb, { transform: [{ translateX: thumbTranslate }] }]}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default AvailabilityCard;

// styles unchanged

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