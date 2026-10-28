/**
 * Temperature and Unit Conversion Utilities for SkyCast Glass
 */

export const celsiusToFahrenheit = (celsius) => {
  if (celsius === null || celsius === undefined || isNaN(celsius)) return '--';
  return Math.round((celsius * 9) / 5 + 32);
};

export const fahrenheitToCelsius = (fahrenheit) => {
  if (fahrenheit === null || fahrenheit === undefined || isNaN(fahrenheit)) return '--';
  return Math.round(((fahrenheit - 32) * 5) / 9);
};

export const formatTemperature = (celsius, unit = 'C') => {
  if (celsius === null || celsius === undefined || isNaN(celsius)) return '--°';
  const temp = unit === 'F' ? celsiusToFahrenheit(celsius) : Math.round(celsius);
  return `${temp}°`;
};

export const formatWindSpeed = (kmh, unit = 'km/h') => {
  if (kmh === null || kmh === undefined || isNaN(kmh)) return '--';
  if (unit === 'mph') {
    return `${Math.round(kmh * 0.621371)} mph`;
  }
  if (unit === 'm/s') {
    return `${(kmh / 3.6).toFixed(1)} m/s`;
  }
  return `${Math.round(kmh)} km/h`;
};

export const formatPressure = (hPa, unit = 'hPa') => {
  if (hPa === null || hPa === undefined || isNaN(hPa)) return '--';
  if (unit === 'inHg') {
    return `${(hPa * 0.02953).toFixed(2)} inHg`;
  }
  if (unit === 'mmHg') {
    return `${Math.round(hPa * 0.750062)} mmHg`;
  }
  return `${Math.round(hPa)} hPa`;
};

export const formatVisibility = (meters, unit = 'km') => {
  if (meters === null || meters === undefined || isNaN(meters)) return '--';
  const km = meters / 1000;
  if (unit === 'mi') {
    return `${(km * 0.621371).toFixed(1)} mi`;
  }
  return `${km.toFixed(1)} km`;
};

export const getWindDirection = (degrees) => {
  if (degrees === null || degrees === undefined || isNaN(degrees)) return '--';
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((degrees % 360) / 22.5) % 16;
  return directions[index];
};
