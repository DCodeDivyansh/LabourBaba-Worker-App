import { api } from "./api";

export const getWorkerBookings = async () => {
  const { data } = await api.get("/api/workers/me/bookings");
  return data;
};

export const getBookingDetail = async (bookingId: string) => {
  const { data } = await api.get(`/api/bookings/${bookingId}`);
  return data;
};

// ⬅ FIXED: was api.patch — backend route is router.post("/:bookingId/complete", ...)
export const completeBooking = async (bookingId: string) => {
  const { data } = await api.post(`/api/bookings/${bookingId}/complete`);
  return data;
};

// ⬅ NEW: was missing entirely. POST /api/bookings/:bookingId/otp/verify, body { otp }
export const verifyOtp = async (bookingId: string, otp: string) => {
  const { data } = await api.post(`/api/bookings/${bookingId}/otp/verify`, { otp });
  return data;
};

// ⬅ NEW: was missing entirely. POST /api/bookings/:bookingId/cancel, body { reason }
// CancelBookingReqSchema requires reason: string, min length 1.
export const cancelBooking = async (bookingId: string, reason: string) => {
  const { data } = await api.post(`/api/bookings/${bookingId}/cancel`, { reason });
  return data;
};