import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Config from "react-native-config";

export const api = axios.create({
  baseURL: "https://api.labourbaba.in",
});

// ⚠️ Path is a guess — replace with your actual backend route if different.
export async function respondToJobOffer(
  jobId: string,
  decision: "accept" | "reject"
): Promise<void> {
  await api.post(`/worker/jobs/${jobId}/respond`, { decision });
}

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config; // <- MUST return config
  },
  (error) => Promise.reject(error)
); 