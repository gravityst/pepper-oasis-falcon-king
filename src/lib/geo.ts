import { Vector3 } from "three";

export const EARTH_RADIUS = 1;

/** World-space sunlight direction. Matches the key directional light. */
export const SUN_DIR = new Vector3(-0.72, 0.38, 0.58).normalize();

/**
 * Convert geographic coordinates to a Three.js position on a Y-up sphere
 * whose UVs match a standard equirectangular Earth texture.
 */
export function latLngToVector3(lat: number, lng: number, radius = EARTH_RADIUS): Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}
