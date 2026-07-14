import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Alert,
} from 'react-native';

import AvailabilityIcon from '../../assets/Avaliable.svg';
import { updateOnlineStatus } from '../services/workerOnline';
import { getWorkerProfile } from '../services/workerprofile';
import { useOnlineStatus } from '../api/OnlineStatusContext';
import { getCurrentLocation } from '../services/location';
import { updateWorkerLocation } from '../services/workerLocation';
import { getAddressFromCoordinates } from '../services/reverseGeocode';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { socket } from '../services/socket';

interface Props {
  setAddress: (address: string) => void;
}

const SOCKET_CONNECT_TIMEOUT_MS = 10000;

const connectSocket = (timeoutMs = SOCKET_CONNECT_TIMEOUT_MS): Promise<void> => {
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
      reject(err instanceof Error ? err : new Error(err?.message || 'Connection failed'));
    };

    socket.once('connect', onConnect);
    socket.once('connect_error', onError);
    socket.connect();
  });
};

const joinWorkerRoom = async (workerId: string) => {
  if (!socket.connected) {
    await connectSocket();
  }
  socket.emit('join:worker', workerId);
  console.log('Joined worker room:', workerId);
};

const syncWorkerLocation = async (setAddress: (address: string) => void) => {
  const { latitude, longitude } = await getCurrentLocation();
  await updateWorkerLocation(latitude, longitude);
  const address = await getAddressFromCoordinates(latitude, longitude);
  setAddress(address);
};

const getWorkerId = async (): Promise<string | null> => {
  const workerString = await AsyncStorage.getItem('worker');
  if (!workerString) return null;
  try {
    return JSON.parse(workerString).id ?? null;
  } catch {
    return null;
  }
};

const AvailabilityCard = ({ setAddress }: Props) => {
  const { isOnline, setIsOnline } = useOnlineStatus();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [syncingStatus, setSyncingStatus] = useState(true);
  const [connectionIssue, setConnectionIssue] = useState(false); // ⬅ NEW
  const [reconnecting, setReconnecting] = useState(false); // ⬅ NEW
  const thumbAnim = useRef(new Animated.Value(isOnline ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(thumbAnim, {
      toValue: isOnline ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isOnline, thumbAnim]);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const response = await getWorkerProfile();
        const actuallyOnline = !!response?.data?.is_online;

        if (!isMounted) return;
        setIsOnline(actuallyOnline);

        if (actuallyOnline) {
          const workerId = await getWorkerId();
          if (workerId) {
            try {
              await joinWorkerRoom(workerId);
              if (isMounted) setConnectionIssue(false);
            } catch (err) {
              console.log('[AvailabilityCard] Could not restore socket session:', err);
              // ⬅ NEW: was silently swallowed before — the toggle looked
              // "online" while the live connection had actually failed to
              // restore. Now surfaced as a visible banner with a retry.
              if (isMounted) setConnectionIssue(true);
            }
          }
        }
      } catch (err) {
        console.log('[AvailabilityCard] Failed to sync online status:', err);
      } finally {
        if (isMounted) setSyncingStatus(false);
      }
    })();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const thumbTranslate = thumbAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22],
  });

  const goOnline = useCallback(async (workerId: string) => {
    try {
      await joinWorkerRoom(workerId);
      setConnectionIssue(false);
    } catch (err) {
      console.log('[AvailabilityCard] Socket connection failed:', err);
      Alert.alert(
        'Connection Problem',
        "Couldn't connect to the live job feed. Check your internet connection and try again."
      );
      throw err;
    }

    try {
      await syncWorkerLocation(setAddress);
    } catch (err) {
      console.log('[AvailabilityCard] Location error:', err);
      Alert.alert(
        'Location Needed',
        "We couldn't get your location. Please enable location services and try again."
      );
      throw err;
    }
  }, [setAddress]);

  const handleToggle = async () => {
    if (loading || syncingStatus) return;

    const newStatus = !isOnline;

    setLoading(true);
    try {
      const workerId = await getWorkerId();
      if (!workerId) {
        Alert.alert('Not Signed In', 'Please log in again to continue.');
        return;
      }

      if (newStatus) {
        await goOnline(workerId);
      }

      const response = await updateOnlineStatus(newStatus);

      if (!response?.success) {
        Alert.alert('Something Went Wrong', "Couldn't update your availability. Please try again.");
        return;
      }

      setIsOnline(response.data.is_online);

      if (!newStatus && socket.connected) {
        socket.disconnect();
        console.log('DISCONNECTED', 'worker went offline');
        setConnectionIssue(false); // going offline on purpose — banner no longer relevant
      }
    } catch (err) {
      console.log('[AvailabilityCard] Toggle failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // ⬅ NEW: lets the worker manually retry restoring the live connection
  // without having to toggle offline and back online.
  const handleReconnect = async () => {
    if (reconnecting) return;
    setReconnecting(true);
    try {
      const workerId = await getWorkerId();
      if (!workerId) {
        Alert.alert('Not Signed In', 'Please log in again to continue.');
        return;
      }
      await joinWorkerRoom(workerId);
      setConnectionIssue(false);
    } catch (err) {
      console.log('[AvailabilityCard] Reconnect retry failed:', err);
      Alert.alert(
        'Still Not Connected',
        "We couldn't restore your live job feed. Check your internet connection and try again."
      );
    } finally {
      setReconnecting(false);
    }
  };

  const isBusy = loading || syncingStatus;

  const title = isBusy
    ? t('dashboard.availability.goingOnline')
    : isOnline
      ? t('dashboard.availability.availableNow')
      : t('dashboard.availability.offlineTitle', "You're Offline");

  const subtitle = isOnline
    ? t('dashboard.availability.subtitle')
    : t('dashboard.availability.offlineSubtitle', 'Turn on to start receiving job requests');

  return (
    <View>
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
          disabled={isBusy}
        >
          {isBusy ? (
            <ActivityIndicator size="small" color="#FF6200" style={styles.loader} />
          ) : (
            <Animated.View
              style={[styles.thumb, { transform: [{ translateX: thumbTranslate }] }]}
            />
          )}
        </TouchableOpacity>
      </View>

      {/* ⬅ NEW: visible banner — replaces the previously-silent failure when
          the app restores an "online" worker's session but can't actually
          reconnect the live socket. Only shows while marked online. */}
      {isOnline && connectionIssue && (
        <View style={styles.banner}>
          <Text style={styles.bannerText} numberOfLines={2}>
            {t(
              'dashboard.availability.connectionIssue',
              "You're marked online, but we couldn't restore your live job feed."
            )}
          </Text>

          <TouchableOpacity
            style={styles.bannerButton}
            onPress={handleReconnect}
            disabled={reconnecting}
            activeOpacity={0.8}
          >
            {reconnecting ? (
              <ActivityIndicator size="small" color="#B45309" />
            ) : (
              <Text style={styles.bannerButtonText}>
                {t('dashboard.availability.retry', 'Retry')}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}
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
  leftContainer: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconBadge: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#FF6200',
    justifyContent: 'center', alignItems: 'center',
  },
  textContainer: { marginLeft: 12, flex: 1 },
  title: { color: '#1E1E1E', fontSize: 16, fontWeight: '700' },
  subtitle: { color: '#8A7A72', fontSize: 13, marginTop: 3, lineHeight: 17 },
  toggleTrack: { width: 52, height: 30, borderRadius: 15, backgroundColor: '#EDEDED', justifyContent: 'center' },
  toggleTrackOn: { backgroundColor: '#FFDAC2' },
  thumb: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#FF6200' },
  loader: { alignSelf: 'center' },

  // ⬅ NEW
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    borderWidth: 1,
    borderColor: '#F5D98A',
    borderRadius: 14,
    marginHorizontal: 16,
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  bannerText: {
    flex: 1,
    color: '#8A6D1D',
    fontSize: 12.5,
    lineHeight: 17,
    marginRight: 10,
  },
  bannerButton: {
    backgroundColor: '#FDECC8',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 7,
    minWidth: 56,
    alignItems: 'center',
  },
  bannerButtonText: {
    color: '#8A6D1D',
    fontSize: 12.5,
    fontWeight: '700',
  },
});