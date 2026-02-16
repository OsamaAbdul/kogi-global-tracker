export interface GeoResult {
  lat: number;
  lng: number;
  locationName: string;
}

export async function getIpGeolocation(): Promise<GeoResult> {
  console.log("Fetching IP geolocation...");
  try {
    // try freeipapi.com (HTTPS friendly)
    const res = await fetch("https://freeipapi.com/api/json");
    const data = await res.json();
    console.log("IP geolocation result:", data);

    return {
      lat: data.latitude,
      lng: data.longitude,
      locationName: `${data.cityName}, ${data.countryName}`,
    };
  } catch (err) {
    console.warn("Primary IP Geoloc failed. Trying secondary fallback...");
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();
      return {
        lat: data.latitude,
        lng: data.longitude,
        locationName: `${data.city}, ${data.country_name}`,
      };
    } catch (err2) {
      console.error("Secondary IP Geoloc error:", err2);
      throw new Error("Could not get IP geolocation");
    }
  }
}

export function getCurrentPosition(): Promise<GeolocationPosition | { coords: { latitude: number; longitude: number } }> {
  return new Promise((resolve) => {
    console.log("Getting current position...");
    if (!navigator.geolocation) {
      console.log("Navigator geolocation NOT supported. Using IP fallback.");
      getIpGeolocation().then((res) => resolve({ coords: { latitude: res.lat, longitude: res.lng } }));
      return;
    }

    console.log("Requesting browser geolocation...");
    navigator.geolocation.getCurrentPosition((pos) => {
      console.log("Browser geolocation SUCCESS:", pos.coords);
      resolve(pos);
    }, async (err) => {
      console.warn("Browser geolocation FAILED:", err.message, "Trying IP fallback...");
      try {
        const res = await getIpGeolocation();
        resolve({ coords: { latitude: res.lat, longitude: res.lng } });
      } catch (ipErr) {
        console.error("Both browser and IP geolocation FAILED. Using default Nigeria fallback.");
        // Fallback to a default if both fail (e.g., Nigeria center)
        resolve({ coords: { latitude: 9.082, longitude: 8.6753 } });
      }
    }, {
      enableHighAccuracy: false,
      timeout: 8000,
    });
  });
}

export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=10`
    );
    const data = await res.json();
    const city = data.address?.city || data.address?.town || data.address?.village || data.address?.state || "Unknown";
    const country = data.address?.country || "Unknown";
    return `${city}, ${country}`;
  } catch {
    return "Unknown Location";
  }
}

export function offsetCoords(lat: number, lng: number, kmOffset = 5): { lat: number; lng: number } {
  // Random offset ~5km in a random direction
  const angle = Math.random() * 2 * Math.PI;
  const kmPerDegreeLat = 111;
  const kmPerDegreeLng = 111 * Math.cos((lat * Math.PI) / 180);
  return {
    lat: lat + (kmOffset * Math.sin(angle)) / kmPerDegreeLat,
    lng: lng + (kmOffset * Math.cos(angle)) / kmPerDegreeLng,
  };
}
