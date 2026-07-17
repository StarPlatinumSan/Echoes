export interface MapPoint {
  x: number;
  y: number;
}

const MAP_WIDTH = 16_384;
const MAP_HEIGHT = 12_288;

// The archive's scale reference: Zone 11 to Zone 12 is 500 km.
const ZONE_11: MapPoint = { x: 0.321219, y: 0.485179 };
const ZONE_12: MapPoint = { x: 0.379836, y: 0.472699 };
const REFERENCE_DISTANCE_KM = 500;

function sourcePixelDistance(start: MapPoint, end: MapPoint) {
  return Math.hypot(
    (end.x - start.x) * MAP_WIDTH,
    (end.y - start.y) * MAP_HEIGHT,
  );
}

export const KM_PER_MAP_PIXEL =
  REFERENCE_DISTANCE_KM / sourcePixelDistance(ZONE_11, ZONE_12);

export function calculateMapDistanceKm(start: MapPoint, end: MapPoint) {
  return sourcePixelDistance(start, end) * KM_PER_MAP_PIXEL;
}
