import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchWeather, fetchWeatherByCoords } from '../services/weatherService';

const DEFAULT_CITY = 'Tashkent';

/**
 * useWeather hook — central state manager for weather data.
 * Exposes: weatherData, loading, error, fetchCity, fetchByLocation, refetch.
 */
export const useWeather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuery, setCurrentQuery] = useState(DEFAULT_CITY);
  const abortRef = useRef(null);

  const load = useCallback(async (query) => {
    // Cancel previous in-flight request
    if (abortRef.current) {
      abortRef.current.abort = true;
    }
    const token = { abort: false };
    abortRef.current = token;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchWeather(query);
      if (token.abort) return;
      setWeatherData(data);
      setCurrentQuery(query);
    } catch (err) {
      if (token.abort) return;
      let message = 'Failed to fetch weather data. Please try again.';
      if (err.message === 'INVALID_API_KEY') {
        message = 'Invalid API key. Please check your VITE_WEATHER_API_KEY in .env.local.';
      } else if (err.message === 'RATE_LIMIT') {
        message = 'API rate limit exceeded. Please wait a moment before trying again.';
      } else if (err.message.toLowerCase().includes('no matching')) {
        message = `City "${query}" not found. Please try another city name.`;
      }
      setError(message);
      setWeatherData(null);
    } finally {
      if (!token.abort) setLoading(false);
    }
  }, []);

  const fetchCity = useCallback((query) => {
    if (!query) return;
    load(query);
  }, [load]);

  const fetchByLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const data = await fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
          setWeatherData(data);
          setCurrentQuery(`${pos.coords.latitude},${pos.coords.longitude}`);
        } catch (err) {
          setError('Could not fetch weather for your location.');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setLoading(false);
        if (err.code === 1) {
          setError('Location access denied. Please search for a city instead.');
        } else {
          setError('Unable to determine your location. Please search manually.');
        }
      },
      { timeout: 10000 }
    );
  }, []);

  const refetch = useCallback(() => {
    load(currentQuery);
  }, [load, currentQuery]);

  // Initial load
  useEffect(() => {
    load(DEFAULT_CITY);
  }, [load]);

  return {
    weatherData,
    loading,
    error,
    currentQuery,
    fetchCity,
    fetchByLocation,
    refetch,
  };
};
