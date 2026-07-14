import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid, Platform } from 'react-native';

export const getCurrentLocation = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    console.log('Permission Result:', granted);

    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      throw new Error('Location permission denied');
    }
  }

  // ⬅ NEW: iOS never had a permission request at all — getCurrentPosition
  // would just silently fail/time out there without this.
  if (Platform.OS === 'ios') {
    const authStatus = await Geolocation.requestAuthorization('whenInUse');
    console.log('iOS Authorization Result:', authStatus);

    if (authStatus !== 'granted') {
      throw new Error('Location permission denied');
    }
  }

  return new Promise<{ latitude: number; longitude: number }>((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => reject(error),
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 5000,
      },
    );
  });
};