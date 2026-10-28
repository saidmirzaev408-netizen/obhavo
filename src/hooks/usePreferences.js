import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEYS = {
  FAVORITES: 'skycast_favorites',
  RECENT: 'skycast_recent',
  UNIT_TEMP: 'skycast_unit_temp',
  UNIT_WIND: 'skycast_unit_wind',
  UNIT_PRESSURE: 'skycast_unit_pressure',
  THEME: 'skycast_theme',
  REDUCED_MOTION: 'skycast_reduced_motion',
};

const safeRead = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v !== null ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};

const safeWrite = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

export const usePreferences = () => {
  const [favorites, setFavorites] = useState(() => safeRead(STORAGE_KEYS.FAVORITES, []));
  const [recentSearches, setRecentSearches] = useState(() => safeRead(STORAGE_KEYS.RECENT, []));
  const [tempUnit, setTempUnit] = useState(() => safeRead(STORAGE_KEYS.UNIT_TEMP, 'C'));
  const [windUnit, setWindUnit] = useState(() => safeRead(STORAGE_KEYS.UNIT_WIND, 'km/h'));
  const [pressureUnit, setPressureUnit] = useState(() => safeRead(STORAGE_KEYS.UNIT_PRESSURE, 'hPa'));
  const [isDark, setIsDark] = useState(() => safeRead(STORAGE_KEYS.THEME, true));
  const [reducedMotion, setReducedMotion] = useState(() => safeRead(STORAGE_KEYS.REDUCED_MOTION, false));

  // Apply dark/light class to <html>
  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
      html.classList.remove('light');
    } else {
      html.classList.add('light');
      html.classList.remove('dark');
    }
    safeWrite(STORAGE_KEYS.THEME, isDark);
  }, [isDark]);

  // Persist all settings
  useEffect(() => { safeWrite(STORAGE_KEYS.FAVORITES, favorites); }, [favorites]);
  useEffect(() => { safeWrite(STORAGE_KEYS.RECENT, recentSearches); }, [recentSearches]);
  useEffect(() => { safeWrite(STORAGE_KEYS.UNIT_TEMP, tempUnit); }, [tempUnit]);
  useEffect(() => { safeWrite(STORAGE_KEYS.UNIT_WIND, windUnit); }, [windUnit]);
  useEffect(() => { safeWrite(STORAGE_KEYS.UNIT_PRESSURE, pressureUnit); }, [pressureUnit]);
  useEffect(() => { safeWrite(STORAGE_KEYS.REDUCED_MOTION, reducedMotion); }, [reducedMotion]);

  // ─── Favorites ──────────────────────────────────────────
  const addFavorite = useCallback((city) => {
    setFavorites((prev) => {
      if (prev.some((f) => f.name === city.name && f.country === city.country)) return prev;
      return [...prev, city].slice(0, 10);
    });
  }, []);

  const removeFavorite = useCallback((cityName, country) => {
    setFavorites((prev) => prev.filter((f) => !(f.name === cityName && f.country === country)));
  }, []);

  const isFavorite = useCallback((cityName, country) => {
    return favorites.some((f) => f.name === cityName && f.country === country);
  }, [favorites]);

  // ─── Recent Searches ─────────────────────────────────────
  const addRecent = useCallback((city) => {
    setRecentSearches((prev) => {
      const filtered = prev.filter((r) => !(r.name === city.name && r.country === city.country));
      return [city, ...filtered].slice(0, 8);
    });
  }, []);

  const clearRecent = useCallback(() => setRecentSearches([]), []);

  // ─── Settings ─────────────────────────────────────────────
  const toggleTempUnit = useCallback(() => {
    setTempUnit((u) => (u === 'C' ? 'F' : 'C'));
  }, []);

  const toggleTheme = useCallback(() => setIsDark((v) => !v), []);

  const clearAllData = useCallback(() => {
    setFavorites([]);
    setRecentSearches([]);
    Object.values(STORAGE_KEYS).forEach((k) => {
      try { localStorage.removeItem(k); } catch {}
    });
  }, []);

  return {
    favorites,
    recentSearches,
    tempUnit,
    windUnit,
    setWindUnit,
    pressureUnit,
    setPressureUnit,
    isDark,
    toggleTheme,
    reducedMotion,
    setReducedMotion,
    addFavorite,
    removeFavorite,
    isFavorite,
    addRecent,
    clearRecent,
    toggleTempUnit,
    clearAllData,
  };
};
