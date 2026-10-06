export type Place = {
  id: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  summary: string;
};

export const LOCATIONS: Place[] = [
  {
    id: "reykjavik",
    name: "Reykjavík",
    region: "Iceland",
    lat: 64.1466,
    lng: -21.9426,
    summary: "A small capital on the mid-Atlantic ridge, held between black rock and a pale sky.",
  },
  {
    id: "new-york",
    name: "New York",
    region: "United States",
    lat: 40.7128,
    lng: -74.006,
    summary: "An island of stacked light at the mouth of the Hudson, dense even from orbit.",
  },
  {
    id: "san-francisco",
    name: "San Francisco",
    region: "United States",
    lat: 37.7749,
    lng: -122.4194,
    summary: "A grid against fog, with a gate standing at the edge of the continent.",
  },
  {
    id: "rio",
    name: "Rio de Janeiro",
    region: "Brazil",
    lat: -22.9068,
    lng: -43.1729,
    summary: "Granite peaks and a city pressed thin between forest and a bright bay.",
  },
  {
    id: "marrakech",
    name: "Marrakech",
    region: "Morocco",
    lat: 31.6295,
    lng: -7.9811,
    summary: "Red walls and a living square where the Atlas mountains meet the plain.",
  },
  {
    id: "paris",
    name: "Paris",
    region: "France",
    lat: 48.8566,
    lng: 2.3522,
    summary: "Stone, river, and a measured glow along the Seine after dusk.",
  },
  {
    id: "cairo",
    name: "Cairo",
    region: "Egypt",
    lat: 30.0444,
    lng: 31.2357,
    summary: "The Nile’s oldest city, facing the Giza plateau across a ribbon of water.",
  },
  {
    id: "cape-town",
    name: "Cape Town",
    region: "South Africa",
    lat: -33.9249,
    lng: 18.4241,
    summary: "A city between a flat mountain and two oceans, wind-cut and clear.",
  },
  {
    id: "mumbai",
    name: "Mumbai",
    region: "India",
    lat: 19.076,
    lng: 72.8777,
    summary: "A peninsula of monsoon light reaching into the Arabian Sea.",
  },
  {
    id: "singapore",
    name: "Singapore",
    region: "Singapore",
    lat: 1.3521,
    lng: 103.8198,
    summary: "A garden city on the strait, bright and exact after nightfall.",
  },
  {
    id: "tokyo",
    name: "Tokyo",
    region: "Japan",
    lat: 35.6762,
    lng: 139.6503,
    summary: "An endless low glow across the Kantō plain, still and vast from above.",
  },
  {
    id: "sydney",
    name: "Sydney",
    region: "Australia",
    lat: -33.8688,
    lng: 151.2093,
    summary: "Harbour and sandstone, a city turned toward the Pacific.",
  },
];

export function getPlace(id: string | null): Place | undefined {
  if (!id) return undefined;
  return LOCATIONS.find((place) => place.id === id);
}

export function formatCoord(lat: number, lng: number): string {
  const ns = lat >= 0 ? "N" : "S";
  const ew = lng >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(2)}°${ns}  ${Math.abs(lng).toFixed(2)}°${ew}`;
}
