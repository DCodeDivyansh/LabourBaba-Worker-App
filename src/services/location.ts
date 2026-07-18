import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid, Platform } from 'react-native';

interface LocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  forceRequestLocation?: boolean;
  showLocationDialog?: boolean;
}

const DEFAULT_OPTIONS: LocationOptions = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 0,
  forceRequestLocation: true,
  showLocationDialog: true,
};

export const getCurrentLocation = async (options?: LocationOptions) => {
  if (Platform.OS === 'android') {
    // Fast path: if permission was already granted (the common case once a
    // worker has used the app before), PermissionsAndroid.check() resolves
    // immediately without a bridge round trip to the permission dialog
    // machinery. Only fall back to request() when we don't already know.
    const alreadyGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (!alreadyGranted) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        throw new Error('Location permission denied');
      }
    }
  }

  if (Platform.OS === 'ios') {
    const authStatus = await Geolocation.requestAuthorization('whenInUse');

    if (authStatus !== 'granted') {
      throw new Error('Location permission denied');
    }
  }

  const resolvedOptions: LocationOptions = { ...DEFAULT_OPTIONS, ...options };

  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      resolvedOptions,
    );
  });
};

// Preset for callers that just need an approximate "how far away" figure
// (e.g. the incoming-job offer card) rather than a precise check-in fix.
// Lets the OS hand back a recent cached position instantly when it has one,
// instead of always forcing a brand-new high-accuracy GPS lock — that single
// change is usually the difference between an instant distance and a
// multi-second wait on the incoming-job screen.
export const APPROXIMATE_LOCATION_OPTIONS: LocationOptions = {
  enableHighAccuracy: false,
  timeout: 6000,
  maximumAge: 5 * 60 * 1000, // accept a fix up to 5 minutes old
  forceRequestLocation: false,
};