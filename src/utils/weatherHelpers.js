/**
 * Weather Helpers & Code Mappings for SkyCast Glass
 * Handles WMO weather codes, icons, background themes, and air quality interpretations.
 */

export const WMO_WEATHER_CODES = {
  0: { label: 'Clear Sky', icon: 'Sun', type: 'clear', isDayOnly: true },
  1: { label: 'Mainly Clear', icon: 'SunMedium', type: 'clear' },
  2: { label: 'Partly Cloudy', icon: 'CloudSun', type: 'cloudy' },
  3: { label: 'Overcast', icon: 'Cloud', type: 'cloudy' },
  45: { label: 'Foggy', icon: 'CloudFog', type: 'fog' },
  48: { label: 'Depositing Rime Fog', icon: 'CloudFog', type: 'fog' },
  51: { label: 'Light Drizzle', icon: 'CloudDrizzle', type: 'rain' },
  53: { label: 'Moderate Drizzle', icon: 'CloudDrizzle', type: 'rain' },
  55: { label: 'Dense Drizzle', icon: 'CloudRain', type: 'rain' },
  56: { label: 'Light Freezing Drizzle', icon: 'CloudSnow', type: 'snow' },
  57: { label: 'Dense Freezing Drizzle', icon: 'CloudSnow', type: 'snow' },
  61: { label: 'Slight Rain', icon: 'CloudRain', type: 'rain' },
  62: { label: 'Moderate Rain', icon: 'CloudRain', type: 'rain' },
  65: { label: 'Heavy Rain', icon: 'CloudRainWind', type: 'rain' },
  66: { label: 'Light Freezing Rain', icon: 'CloudSnow', type: 'snow' },
  67: { label: 'Heavy Freezing Rain', icon: 'CloudSnow', type: 'snow' },
  71: { label: 'Slight Snowfall', icon: 'CloudSnow', type: 'snow' },
  73: { label: 'Moderate Snowfall', icon: 'CloudSnow', type: 'snow' },
  75: { label: 'Heavy Snowfall', icon: 'Snowflake', type: 'snow' },
  77: { label: 'Snow Grains', icon: 'Snowflake', type: 'snow' },
  80: { label: 'Slight Rain Showers', icon: 'CloudDrizzle', type: 'rain' },
  81: { label: 'Moderate Rain Showers', icon: 'CloudRain', type: 'rain' },
  82: { label: 'Violent Rain Showers', icon: 'CloudRainWind', type: 'rain' },
  85: { label: 'Slight Snow Showers', icon: 'CloudSnow', type: 'snow' },
  86: { label: 'Heavy Snow Showers', icon: 'CloudSnow', type: 'snow' },
  95: { label: 'Thunderstorm', icon: 'CloudLightning', type: 'thunder' },
  96: { label: 'Thunderstorm with Slight Hail', icon: 'CloudLightning', type: 'thunder' },
  99: { label: 'Thunderstorm with Heavy Hail', icon: 'CloudLightning', type: 'thunder' },
};

export const getWeatherInfo = (code, isDay = 1) => {
  const info = WMO_WEATHER_CODES[code] || { label: 'Partly Cloudy', icon: 'CloudSun', type: 'cloudy' };
  
  // Night overrides for clear/mainly clear
  let icon = info.icon;
  if (!isDay && (code === 0 || code === 1)) {
    icon = 'Moon';
  } else if (!isDay && code === 2) {
    icon = 'CloudMoon';
  }

  return {
    ...info,
    icon,
  };
};

/**
 * Returns atmospheric gradient background CSS classes based on weather type and time of day
 */
export const getWeatherBackground = (weatherCode, isDay = 1, isDark = true) => {
  const info = getWeatherInfo(weatherCode, isDay);
  const type = info.type;

  if (!isDay) {
    // Night background
    return {
      gradient: 'from-[#0b0f19] via-[#111827] to-[#1e1b4b]',
      ambient: 'rgba(99, 102, 241, 0.15)',
      theme: 'night'
    };
  }

  switch (type) {
    case 'clear':
      return isDark
        ? { gradient: 'from-[#0c2444] via-[#123e6d] to-[#1e293b]', ambient: 'rgba(56, 189, 248, 0.25)', theme: 'clear' }
        : { gradient: 'from-[#bae6fd] via-[#7dd3fc] to-[#e0f2fe]', ambient: 'rgba(14, 165, 233, 0.2)', theme: 'clear-light' };
    case 'cloudy':
      return isDark
        ? { gradient: 'from-[#1e293b] via-[#334155] to-[#0f172a]', ambient: 'rgba(148, 163, 184, 0.2)', theme: 'cloudy' }
        : { gradient: 'from-[#e2e8f0] via-[#cbd5e1] to-[#f8fafc]', ambient: 'rgba(100, 116, 139, 0.15)', theme: 'cloudy-light' };
    case 'rain':
      return isDark
        ? { gradient: 'from-[#0f172a] via-[#1e1b4b] to-[#172554]', ambient: 'rgba(96, 165, 250, 0.2)', theme: 'rain' }
        : { gradient: 'from-[#cbd5e1] via-[#93c5fd] to-[#dbeafe]', ambient: 'rgba(59, 130, 246, 0.2)', theme: 'rain-light' };
    case 'thunder':
      return isDark
        ? { gradient: 'from-[#090d16] via-[#1e1b4b] to-[#2e1065]', ambient: 'rgba(168, 85, 247, 0.25)', theme: 'thunder' }
        : { gradient: 'from-[#475569] via-[#64748b] to-[#312e81]', ambient: 'rgba(147, 51, 234, 0.2)', theme: 'thunder-light' };
    case 'snow':
      return isDark
        ? { gradient: 'from-[#1e293b] via-[#164e63] to-[#083344]', ambient: 'rgba(103, 232, 249, 0.2)', theme: 'snow' }
        : { gradient: 'from-[#e0f2fe] via-[#cffafe] to-[#f0fdfa]', ambient: 'rgba(6, 182, 212, 0.15)', theme: 'snow-light' };
    case 'fog':
    default:
      return isDark
        ? { gradient: 'from-[#1e293b] via-[#334155] to-[#1e293b]', ambient: 'rgba(148, 163, 184, 0.15)', theme: 'fog' }
        : { gradient: 'from-[#f1f5f9] via-[#e2e8f0] to-[#f8fafc]', ambient: 'rgba(148, 163, 184, 0.15)', theme: 'fog-light' };
  }
};

/**
 * UV index description and color
 */
export const getUVGuidance = (uv) => {
  if (uv === null || uv === undefined) return { label: 'Unknown', color: 'text-gray-400', bg: 'bg-gray-500/20', advice: 'No UV data available.' };
  if (uv <= 2) {
    return { label: 'Low', color: 'text-emerald-400', bg: 'bg-emerald-500/20', advice: 'Low risk. No protection required. Enjoy the outdoors!' };
  }
  if (uv <= 5) {
    return { label: 'Moderate', color: 'text-yellow-400', bg: 'bg-yellow-500/20', advice: 'Moderate risk. Wear sunscreen and sunglasses if outdoors.' };
  }
  if (uv <= 7) {
    return { label: 'High', color: 'text-orange-400', bg: 'bg-orange-500/20', advice: 'High risk. Protection essential: wear hat, SPF 30+, seek shade midday.' };
  }
  if (uv <= 10) {
    return { label: 'Very High', color: 'text-rose-500', bg: 'bg-rose-500/20', advice: 'Very high risk. Avoid midday sun, protect skin and eyes.' };
  }
  return { label: 'Extreme', color: 'text-purple-400', bg: 'bg-purple-500/20', advice: 'Extreme risk! Take full precautions. Unprotected skin can burn quickly.' };
};

/**
 * US AQI scale interpretation
 */
export const getAQIInfo = (aqi) => {
  if (aqi === null || aqi === undefined) return { label: 'Moderate', category: 'Fair', color: 'text-yellow-400', badge: 'bg-yellow-500/20', desc: 'Air quality is acceptable.' };
  if (aqi <= 50) {
    return { label: 'Good', category: 'Excellent', color: 'text-emerald-400', badge: 'bg-emerald-500/20', desc: 'Air quality is satisfactory and poses little or no risk.' };
  }
  if (aqi <= 100) {
    return { label: 'Moderate', category: 'Acceptable', color: 'text-yellow-400', badge: 'bg-yellow-500/20', desc: 'Air quality is acceptable for most people; sensitive individuals may notice.' };
  }
  if (aqi <= 150) {
    return { label: 'Unhealthy for Sensitive Groups', category: 'Sensitive Warning', color: 'text-orange-400', badge: 'bg-orange-500/20', desc: 'Members of sensitive groups may experience health effects.' };
  }
  if (aqi <= 200) {
    return { label: 'Unhealthy', category: 'Hazardous', color: 'text-rose-400', badge: 'bg-rose-500/20', desc: 'Everyone may begin to experience health effects; limit outdoor exertion.' };
  }
  return { label: 'Very Unhealthy', category: 'Severe Alert', color: 'text-purple-400', badge: 'bg-purple-500/20', desc: 'Health alert: serious risk of health effects for all individuals.' };
};

/**
 * Format date nicely
 */
export const formatWeatherDate = (isoString, timezone = 'UTC') => {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      timeZone: timezone === 'auto' ? undefined : timezone,
    }).format(date);
  } catch (e) {
    return isoString;
  }
};

export const formatTime = (isoString, timezone = 'UTC') => {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: timezone === 'auto' ? undefined : timezone,
    }).format(date);
  } catch (e) {
    return isoString;
  }
};
