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

  if (Platform.OS === 'ios') {
    const authStatus = await Geolocation.requestAuthorization('whenInUse');

    console.log('iOS Authorization Result:', authStatus);

    if (authStatus !== 'granted') {
      throw new Error('Location permission denied');
    }
  }

  console.log('Requesting current location...');

  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        console.log('LOCATION SUCCESS');
        console.log(position);

        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.log('LOCATION ERROR');
        console.log(error);

        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
        forceRequestLocation: true,
        showLocationDialog: true,
      },
    );
  });
};