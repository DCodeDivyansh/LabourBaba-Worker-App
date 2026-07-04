import { api } from "./api";

/**
 * GET /api/dispatch/incoming
 * Returns every job_dispatch row that is still "pending" for the logged-in
 * worker, with the job_requirement -> job -> customer chain populated.
 * The socket only sends light-weight fields (requirementId, jobId, skillType,
 * ratePerDay, expiresAt), so the Incoming Job screen calls this endpoint to
 * fetch the full customer + job details for the job that was just pushed.
 */
export const getIncomingDispatches = async () => {
  const { data } = await api.get("/api/dispatch/incoming");
  return data;
};

/**
 * Finds the specific incoming dispatch entry matching a requirementId.
 * Falls back to the most recent pending dispatch if an exact match
 * isn't found (e.g. slight timing differences between socket + REST).
 */
export const getIncomingDispatchByRequirement = async (requirementId) => {
  const response = await getIncomingDispatches();
  const list = response?.data || [];

  if (!requirementId) {
    return list[0] || null;
  }

  return (
    list.find((d) => d.requirement_id === requirementId) || list[0] || null
  );
};

// POST /api/dispatch/:requirementId/accept
export const acceptDispatch = async (requirementId) => {
  const { data } = await api.post(`/api/dispatch/${requirementId}/accept`);
  return data;
};

// POST /api/dispatch/:requirementId/decline
export const declineDispatch = async (requirementId) => {
  const { data } = await api.post(`/api/dispatch/${requirementId}/decline`);
  return data;
};
