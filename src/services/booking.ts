import { api } from "./api";

export const getWorkerBookings = async () => {
  const { data } = await api.get("/api/workers/me/bookings");
  return data;
};

export const getBookingDetail = async (bookingId: string) => {
  const { data } = await api.get(`/api/bookings/${bookingId}`);
  return data;
};
