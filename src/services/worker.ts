import { api } from "./api";
// import api from './api'; // ⬅ matches the pattern of your other service files

export const updateDeviceToken = async (deviceToken: string) => {
  const response = await api.patch('/api/workers/me/device-token', { device_token: deviceToken });
  return response.data;
};

export const registerWorker = async (workerData: any) => {
  const { data } = await api.post(
    "/api/workers/registerWorker",
    workerData
  );

  return data;
};