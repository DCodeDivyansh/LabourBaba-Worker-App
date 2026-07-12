import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
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
        // ===== GOING ONLINE =====

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

        const address = await getAddressFromCoordinates(
          latitude,
          longitude
        );

        setAddress(address);
      }

      const response = await updateOnlineStatus(newStatus);

      if (response.success) {
        setIsOnline(response.data.is_online);

        // ===== GOING OFFLINE =====
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

  return (
    <View style={styles.card}>
      <View style={styles.leftContainer}>
        <AvailabilityIcon width={28} height={28} />

        <View style={styles.textContainer}>
          <Text style={styles.title}>
            {loading
              ? t('dashboard.availability.goingOnline')
              : t('dashboard.availability.availableNow')}
          </Text>

          <Text style={styles.subtitle}>
            {t('dashboard.availability.subtitle')}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.toggle}
        onPress={handleToggle}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color="#FF6200"
          />
        ) : (
          <View
            style={[
              styles.thumb,
              isOnline && styles.thumbRight,
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
    backgroundColor: '#FF6200',
    borderRadius: 16,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 18,
    paddingVertical: 18,

    marginHorizontal: 16,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
  },

  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  textContainer: {
    marginLeft: 12,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },

  subtitle: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 4,
    lineHeight: 18,
  },

  toggle: {
    width: 52,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },

  thumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FF6200',
  },

  thumbRight: {
    alignSelf: 'flex-end',
  },
});