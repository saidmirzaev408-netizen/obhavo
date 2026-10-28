import React, { useState } from 'react';
import {
  Wind, Settings, Moon, Sun, Heart,
  MapPin, Thermometer, RefreshCw
} from 'lucide-react';
import CitySearch from './CitySearch';

/**
 * Navbar — glass navigation bar with logo, search, toggles, and action buttons.
 */
const Navbar = ({
  onCitySelect,
  onLocate,
  onSettingsOpen,
  onFavoritesOpen,
  toggleTheme,
  toggleTempUnit,
  isDark,
  tempUnit,
  onRefresh,
  loading,
}) => {
  return (
    <header className="glass-nav sticky top-0 z-40 px-4 md:px-6">
      <div className="max-w-screen-2xl mx-auto flex items-center gap-3 h-14 md:h-16">

        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0 select-none">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-xl"
            style={{ background: 'linear-gradient(135deg, #6366f1, #60a5fa)' }}>
            <Wind size={16} className="text-white" />
          </div>
          <span className="hidden sm:block text-sm font-bold gradient-text tracking-tight whitespace-nowrap">
            SkyCast Glass
          </span>
        </div>

        {/* Search */}
        <div className="flex-1 min-w-0">
          <CitySearch onCitySelect={onCitySelect} isDark={isDark} />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0">

          {/* Location */}
          <button
            id="locate-btn"
            onClick={onLocate}
            className="glass-btn p-2 md:px-3"
            title="Use my location"
            aria-label="Use current location"
          >
            <MapPin size={15} className={isDark ? 'text-white/70' : 'text-gray-600'} />
          </button>

          {/* Refresh */}
          <button
            id="refresh-btn"
            onClick={onRefresh}
            className="glass-btn p-2 hidden sm:flex"
            title="Refresh weather data"
            aria-label="Refresh"
            disabled={loading}
          >
            <RefreshCw size={15} className={`${loading ? 'animate-spin' : ''} ${isDark ? 'text-white/70' : 'text-gray-600'}`} />
          </button>

          {/* Temp unit toggle */}
          <button
            id="temp-unit-btn"
            onClick={toggleTempUnit}
            className="glass-btn px-2.5 py-1.5 text-xs font-bold tabular-nums"
            title="Toggle temperature unit"
            aria-label={`Switch to ${tempUnit === 'C' ? 'Fahrenheit' : 'Celsius'}`}
          >
            <span className={isDark ? 'text-white/80' : 'text-gray-700'}>°{tempUnit}</span>
          </button>

          {/* Theme toggle */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            className="glass-btn p-2"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle theme"
          >
            {isDark
              ? <Sun size={15} className="text-yellow-300" />
              : <Moon size={15} className="text-indigo-500" />
            }
          </button>

          {/* Favorites */}
          <button
            id="favorites-btn"
            onClick={onFavoritesOpen}
            className="glass-btn p-2 hidden sm:flex"
            title="Favorite cities"
            aria-label="Favorites"
          >
            <Heart size={15} className={isDark ? 'text-rose-400' : 'text-rose-500'} />
          </button>

          {/* Settings */}
          <button
            id="settings-btn"
            onClick={onSettingsOpen}
            className="glass-btn p-2"
            title="Settings"
            aria-label="Settings"
          >
            <Settings size={15} className={isDark ? 'text-white/70' : 'text-gray-600'} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
