export const getAddressFromCoordinates = async (
  latitude: number,
  longitude: number,
) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
      {
        headers: {
          'User-Agent': 'LabourBaba',
        },
      },
    );

    const data = await response.json();

    if (data?.display_name) {
      return data.display_name;
    }

    return 'Unknown location';
  } catch (error) {
    console.log('Reverse Geocoding Error:', error);
    return 'Unable to fetch address';
  }
};