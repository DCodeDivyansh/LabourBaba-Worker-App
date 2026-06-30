import { api } from "./api";

export interface LoginRequest {
  phone: string;
  password: string;
}

export const workerLogin = async ({
  phone,
  password,
}: LoginRequest) => {
  const response = await api.post("/api/workers/login", {
    phone,
    password,
  });

  return response.data;
};