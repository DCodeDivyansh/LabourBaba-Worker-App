/**
 * Client-side distance calculation between the worker's current location
 * and a job's coordinates. Computed on-device per your request, rather
 * than relying on a backend-provided `distanceText`/`dist_m` value.
 */

const EARTH_RADIUS_KM = 6371;

function toRad(deg: number): number {
    return (deg * Math.PI) / 180;
}

/** Straight-line (haversine) distance in kilometers between two coordinates. */
export function haversineDistanceKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
): number {
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return EARTH_RADIUS_KM * c;
}

/**
 * Formats a distance in km the way the IncomingJobScreen UI expects
 * (`distanceText`, e.g. "2.5 km" or "850 m" for anything under 1 km).
 */
export function formatDistance(km: number): string {
    if (!Number.isFinite(km) || km < 0) return '--';
    if (km < 1) return `${Math.round(km * 1000)} m`;
    return `${km.toFixed(1)} km`;
}

/**
 * Convenience wrapper: given the worker's current coords (from
 * services/location.ts's getCurrentLocation()) and a job's coords,
 * returns the ready-to-render distance string in one call.
 */
export function distanceTextBetween(
    workerLat: number | null | undefined,
    workerLon: number | null | undefined,
    jobLat: number | null | undefined,
    jobLon: number | null | undefined,
): string {
    if (
        workerLat == null || workerLon == null ||
        jobLat == null || jobLon == null
    ) {
        return '--';
    }
    return formatDistance(haversineDistanceKm(workerLat, workerLon, jobLat, jobLon));
}