import {api} from './api';

export const updateWorkerLocation = async (
  latitude: number,
  longitude: number,
  location: string = '',
) => {
  const response = await api.patch('/api/workers/me/location', {
    worker_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6', // Replace 'current' with the actual worker ID if available
    latitude,
    longitude,
    location,
  });

  return response.data;
};