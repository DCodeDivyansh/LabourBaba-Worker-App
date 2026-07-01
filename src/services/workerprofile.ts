import { api } from "./api";

export const getWorkerProfile = async () => {
  const { data } = await api.get("/api/workers/me");
  return data;
};