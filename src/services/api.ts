import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Config from "react-native-config";

export const api = axios.create({
  baseURL: "https://api.labourbaba.in",
});

// Real routes, confirmed against src/routes/dispatchRoutes.ts:
//   POST /api/dispatch/:requirementId/accept
//   POST /api/dispatch/:requirementId/decline
// Note: keyed by requirementId, NOT jobId — the two are different IDs in
// this system (see JobDispatchSchema / job_requirement table). No request
// body needed; the worker is identified via the JWT the interceptor below
// already attaches.
export async function respondToJobOffer(
  requirementId: string,
  decision: "accept" | "reject"
): Promise<void> {
  const verb = decision === "accept" ? "accept" : "decline";
  await api.post(`/api/dispatch/${requirementId}/${verb}`);
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