/**
 * SkyCast Glass — Weather Service
 * Integrates WeatherAPI.com for real-time weather data.
 * API key is read from VITE_WEATHER_API_KEY environment variable.
 * Never commit real keys to source control — use .env.local instead.
 */

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || '';
const BASE_URL = 'https://api.weatherapi.com/v1';

const isDemoMode = !API_KEY || API_KEY === 'your_api_key_here';

// ─── Demo / sample data (used when no API key is configured) ──────────────────
export const DEMO_DATA = {
  location: {
    name: 'Tashkent',
    region: 'Toshkent',
    country: 'Uzbekistan',
    lat: 41.2995,
    lon: 69.2401,
    tz_id: 'Asia/Tashkent',
    localtime: new Date().toISOString().slice(0, 16).replace('T', ' '),
  },
  current: {
    last_updated: new Date().toISOString().slice(0, 16).replace('T', ' '),
    temp_c: 18,
    temp_f: 64.4,
    feelslike_c: 16,
    feelslike_f: 60.8,
    is_day: new Date().getHours() >= 6 && new Date().getHours() < 20 ? 1 : 0,
    condition: { text: 'Partly Cloudy', icon: '', code: 2 },
    wind_kph: 14,
    wind_mph: 8.7,
    wind_dir: 'NW',
    wind_degree: 315,
    pressure_mb: 1015,
    pressure_in: 29.98,
    precip_mm: 0,
    humidity: 52,
    cloud: 45,
    visibility: 10,
    vis_km: 10,
    uv: 3,
    gust_kph: 20,
    dewpoint_c: 8,
    dewpoint_f: 46.4,
    air_quality: { 'us-epa-index': 1, pm2_5: 12, pm10: 20, o3: 60, no2: 15, co: 200 },
  },
  forecast: {
    forecastday: Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().slice(0, 10);
      return {
        date: dateStr,
        date_epoch: Math.floor(d.getTime() / 1000),
        day: {
          maxtemp_c: 20 + Math.round(Math.random() * 8 - 4),
          mintemp_c: 10 + Math.round(Math.random() * 4 - 2),
          maxtemp_f: 68 + Math.round(Math.random() * 14 - 7),
          mintemp_f: 50 + Math.round(Math.random() * 7 - 3),
          avgtemp_c: 15,
          avgtemp_f: 59,
          maxwind_kph: 18,
          totalprecip_mm: Math.random() > 0.7 ? Math.round(Math.random() * 10) : 0,
          avghumidity: 50 + Math.round(Math.random() * 20),
          daily_chance_of_rain: Math.round(Math.random() * 60),
          uv: 3,
          condition: { text: ['Partly Cloudy', 'Sunny', 'Light Rain', 'Clear', 'Overcast'][Math.floor(Math.random() * 5)], code: [2, 0, 61, 0, 3][Math.floor(Math.random() * 5)] },
        },
        astro: {
          sunrise: '06:32 AM',
          sunset: '06:48 PM',
          moonrise: '08:15 PM',
          moonset: '08:45 AM',
          moon_phase: 'Waxing Gibbous',
          moon_illumination: 72,
        },
        hour: Array.from({ length: 24 }, (_, h) => ({
          time: `${dateStr} ${String(h).padStart(2, '0')}:00`,
          time_epoch: Math.floor(d.getTime() / 1000) + h * 3600,
          temp_c: 12 + Math.round(Math.sin((h - 6) / 24 * Math.PI * 2) * 8),
          temp_f: 53 + Math.round(Math.sin((h - 6) / 24 * Math.PI * 2) * 14),
          feelslike_c: 10 + Math.round(Math.sin((h - 6) / 24 * Math.PI * 2) * 7),
          condition: { text: h < 6 || h >= 20 ? 'Clear' : 'Partly Cloudy', code: h < 6 || h >= 20 ? 0 : 2 },
          is_day: h >= 6 && h < 20 ? 1 : 0,
          wind_kph: 10 + Math.round(Math.random() * 10),
          chance_of_rain: Math.round(Math.random() * 30),
          will_it_rain: 0,
          humidity: 50 + Math.round(Math.random() * 20),
          vis_km: 10,
          uv: h >= 6 && h < 20 ? 3 : 0,
        })),
      };
    }),
  },
  alerts: { alert: [] },
};

// ─── Helper ─────────────────────────────────────────────────────────────────

const handleResponse = async (res) => {
  if (res.status === 401 || res.status === 403) {
    throw new Error('INVALID_API_KEY');
  }
  if (res.status === 429) {
    throw new Error('RATE_LIMIT');
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error?.message || `HTTP ${res.status}`);
  }
  return res.json();
};

const buildUrl = (endpoint, params) => {
  const url = new URL(`${BASE_URL}/${endpoint}.json`);
  url.searchParams.set('key', API_KEY);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  return url.toString();
};

// ─── Cache layer (5-min TTL) ────────────────────────────────────────────────
const CACHE = new Map();
const CACHE_TTL = 5 * 60 * 1000;

const cacheGet = (key) => {
  const entry = CACHE.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL) {
    CACHE.delete(key);
    return null;
  }
  return entry.data;
};

const cacheSet = (key, data) => {
  CACHE.set(key, { ts: Date.now(), data });
};

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Returns true when no API key is configured (demo mode).
 */
export const getIsDemoMode = () => isDemoMode;

/**
 * Search city autocomplete
 */
export const searchCities = async (query) => {
  if (!query || query.trim().length < 2) return [];
  if (isDemoMode) {
    const demoSuggestions = [
      { id: 1, name: 'Tashkent', region: 'Toshkent', country: 'Uzbekistan', lat: 41.2995, lon: 69.2401 },
      { id: 2, name: 'Samarkand', region: 'Samarqand', country: 'Uzbekistan', lat: 39.6547, lon: 66.9758 },
      { id: 3, name: 'London', region: 'City of London', country: 'United Kingdom', lat: 51.5171, lon: -0.1062 },
      { id: 4, name: 'New York', region: 'New York', country: 'United States', lat: 40.7142, lon: -74.0059 },
      { id: 5, name: 'Tokyo', region: 'Tokyo', country: 'Japan', lat: 35.6895, lon: 139.6917 },
      { id: 6, name: 'Paris', region: 'Île-de-France', country: 'France', lat: 48.8534, lon: 2.3488 },
      { id: 7, name: 'Dubai', region: 'Dubai', country: 'UAE', lat: 25.0657, lon: 55.1713 },
      { id: 8, name: 'Istanbul', region: 'Istanbul', country: 'Turkey', lat: 41.0136, lon: 28.9550 },
    ];
    return demoSuggestions.filter((c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.country.toLowerCase().includes(query.toLowerCase())
    );
  }

  const cacheKey = `search:${query.toLowerCase()}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  try {
    const url = buildUrl('search', { q: query });
    const res = await fetch(url);
    const data = await handleResponse(res);
    cacheSet(cacheKey, data);
    return data;
  } catch (err) {
    console.error('[WeatherService] searchCities error:', err.message);
    return [];
  }
};

/**
 * Fetch full weather data (current + 7-day forecast + alerts + air quality)
 */
export const fetchWeather = async (query) => {
  if (isDemoMode) {
    await new Promise((r) => setTimeout(r, 800)); // simulate loading
    return { ...DEMO_DATA };
  }

  const cacheKey = `weather:${String(query).toLowerCase()}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const url = buildUrl('forecast', {
    q: query,
    days: 7,
    aqi: 'yes',
    alerts: 'yes',
  });

  const res = await fetch(url);
  const data = await handleResponse(res);
  cacheSet(cacheKey, data);
  return data;
};

/**
 * Fetch weather by latitude/longitude (for geolocation)
 */
export const fetchWeatherByCoords = async (lat, lon) => {
  return fetchWeather(`${lat},${lon}`);
};
