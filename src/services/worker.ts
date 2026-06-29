import { api } from "./api";

export const registerWorker = async (workerData: any) => {
  const { data } = await api.post(
    "/api/workers/registerWorker",
    workerData
  );

  return data;
};