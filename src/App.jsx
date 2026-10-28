import React, { useState, useCallback, useMemo } from 'react';
import { AlertCircle, RefreshCw, Wind } from 'lucide-react';

import Navbar from './components/Navbar';
import WeatherHero from './components/WeatherHero';
import WeatherStats from './components/WeatherStats';
import HourlyForecast from './components/HourlyForecast';
import WeeklyForecast from './components/WeeklyForecast';
import WeatherCharts from './components/WeatherCharts';
import SunriseSunset from './components/SunriseSunset';
import AirQuality from './components/AirQuality';
import WeatherAlerts from './components/WeatherAlerts';
import FavoriteCities from './components/FavoriteCities';
import SettingsModal from './components/SettingsModal';
import LoadingSkeleton from './components/LoadingSkeleton';

import { useWeather } from './hooks/useWeather';
import { usePreferences } from './hooks/usePreferences';
import { getWeatherBackground } from './utils/weatherHelpers';
import { getIsDemoMode } from './services/weatherService';

// ─── Cloud ambient layer (decorative background blobs) ───────────────────────
const AmbientLayer = ({ weatherCode, isDay, isDark }) => {
  const bg = getWeatherBackground(weatherCode, isDay, isDark);
  return (
    <>
      <div
        className="fixed inset-0 -z-20 transition-all duration-1000"
        style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))` }}
      />
      {/* We use inline style for dynamic gradient */}
      <div
        className="fixed inset-0 -z-20 transition-all duration-1000"
        style={{
          background: isDark
            ? `linear-gradient(135deg, ${
                bg.theme === 'clear' ? '#0c2444, #123e6d, #1e293b' :
                bg.theme === 'rain' ? '#0f172a, #1e1b4b, #172554' :
                bg.theme === 'thunder' ? '#090d16, #1e1b4b, #2e1065' :
                bg.theme === 'snow' ? '#1e293b, #164e63, #083344' :
                bg.theme === 'night' ? '#0b0f19, #111827, #1e1b4b' :
                '#1e293b, #334155, #0f172a'
              })`
            : `linear-gradient(135deg, ${
                bg.theme.includes('clear') ? '#bae6fd, #7dd3fc, #e0f2fe' :
                bg.theme.includes('rain') ? '#cbd5e1, #93c5fd, #dbeafe' :
                bg.theme.includes('snow') ? '#e0f2fe, #cffafe, #f0fdfa' :
                '#e2e8f0, #cbd5e1, #f8fafc'
              })`,
        }}
      />
      {/* Ambient orbs */}
      <div
        className="fixed -top-32 -left-32 w-96 h-96 rounded-full pointer-events-none -z-10 animate-float-slow"
        style={{ background: isDark ? bg.ambient : bg.ambient, filter: 'blur(80px)', opacity: 0.6 }}
      />
      <div
        className="fixed -bottom-32 -right-32 w-96 h-96 rounded-full pointer-events-none -z-10 animate-float"
        style={{
          background: isDark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.1)',
          filter: 'blur(80px)',
          opacity: 0.5,
          animationDelay: '3s',
        }}
      />
    </>
  );
};

// ─── Error state ──────────────────────────────────────────────────────────────
const ErrorState = ({ message, onRetry, isDark }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 text-center px-4">
    <div className="glass-card p-8 max-w-md w-full flex flex-col items-center gap-4">
      <div className="w-14 h-14 rounded-full flex items-center justify-center"
        style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)' }}>
        <AlertCircle size={28} className="text-rose-400" />
      </div>
      <div>
        <h2 className={`text-lg font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Weather Unavailable
        </h2>
        <p className={`text-sm ${isDark ? 'text-white/55' : 'text-gray-500'}`}>{message}</p>
      </div>
      <button
        id="retry-btn"
        onClick={onRetry}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-indigo-500/80 text-white hover:bg-indigo-500 transition-colors"
      >
        <RefreshCw size={14} />
        Try Again
      </button>
    </div>
  </div>
);

// ─── Demo Mode Banner ─────────────────────────────────────────────────────────
const DemoBanner = ({ isDark }) => (
  <div
    className="flex items-center gap-3 px-4 py-2.5 text-xs rounded-xl border"
    style={{
      background: 'rgba(99,102,241,0.1)',
      borderColor: 'rgba(99,102,241,0.25)',
    }}
  >
    <span className="text-indigo-400 font-medium">🎭 Demo Mode</span>
    <span className={isDark ? 'text-white/50' : 'text-gray-500'}>
      Showing sample data. Add your WeatherAPI key to <code className="px-1 rounded font-mono"
        style={{ background: 'rgba(255,255,255,0.08)' }}>.env.local</code> for live weather.
    </span>
  </div>
);

// ─── Main App ─────────────────────────────────────────────────────────────────
const App = () => {
  const {
    weatherData, loading, error,
    fetchCity, fetchByLocation, refetch
  } = useWeather();

  const {
    favorites, recentSearches,
    tempUnit, toggleTempUnit,
    windUnit, setWindUnit,
    pressureUnit, setPressureUnit,
    isDark, toggleTheme,
    reducedMotion, setReducedMotion,
    addFavorite, removeFavorite, isFavorite,
    addRecent, clearRecent,
    clearAllData,
  } = usePreferences();

  const [showFavorites, setShowFavorites] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleCitySelect = useCallback((city) => {
    fetchCity(`${city.lat},${city.lon}`);
    addRecent(city);
  }, [fetchCity, addRecent]);

  const handleFavoriteToggle = useCallback(() => {
    if (!weatherData?.location) return;
    const loc = weatherData.location;
    const cityObj = { name: loc.name, region: loc.region, country: loc.country, lat: loc.lat, lon: loc.lon };
    if (isFavorite(loc.name, loc.country)) {
      removeFavorite(loc.name, loc.country);
    } else {
      addFavorite(cityObj);
    }
  }, [weatherData, isFavorite, addFavorite, removeFavorite]);

  const weatherCode = weatherData?.current?.condition?.code ?? 2;
  const isDay = weatherData?.current?.is_day ?? 1;
  const isCurrentFav = weatherData?.location
    ? isFavorite(weatherData.location.name, weatherData.location.country)
    : false;

  const isDemoMode = getIsDemoMode();

  return (
    <div className={`min-h-screen ${isDark ? 'text-white' : 'text-gray-900'} relative`}>
      {/* Dynamic atmospheric background */}
      <AmbientLayer weatherCode={weatherCode} isDay={isDay} isDark={isDark} />

      {/* Navigation */}
      <Navbar
        onCitySelect={handleCitySelect}
        onLocate={fetchByLocation}
        onSettingsOpen={() => setShowSettings(true)}
        onFavoritesOpen={() => setShowFavorites(true)}
        toggleTheme={toggleTheme}
        toggleTempUnit={toggleTempUnit}
        isDark={isDark}
        tempUnit={tempUnit}
        onRefresh={refetch}
        loading={loading}
      />

      {/* Main Content */}
      <main className="max-w-screen-xl mx-auto px-4 md:px-6 py-5 md:py-7">

        {/* Demo Mode Banner */}
        {isDemoMode && <div className="mb-4"><DemoBanner isDark={isDark} /></div>}

        {/* Error State */}
        {error && !loading && (
          <ErrorState message={error} onRetry={refetch} isDark={isDark} />
        )}

        {/* Loading State */}
        {loading && <LoadingSkeleton />}

        {/* Weather Content */}
        {!loading && !error && weatherData && (
          <div className="flex flex-col gap-5 md:gap-6">

            {/* Row 1: Hero + Sun/Moon (wide screen) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2">
                <WeatherHero
                  weatherData={weatherData}
                  tempUnit={tempUnit}
                  isDark={isDark}
                  isFavorite={isCurrentFav}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              </div>
              <div className="flex flex-col gap-5">
                <SunriseSunset weatherData={weatherData} isDark={isDark} />
                <AirQuality weatherData={weatherData} isDark={isDark} />
              </div>
            </div>

            {/* Weather Alerts */}
            <WeatherAlerts weatherData={weatherData} isDark={isDark} />

            {/* Row 2: Statistics */}
            <WeatherStats
              weatherData={weatherData}
              tempUnit={tempUnit}
              windUnit={windUnit}
              pressureUnit={pressureUnit}
              isDark={isDark}
            />

            {/* Row 3: Hourly */}
            <HourlyForecast
              weatherData={weatherData}
              tempUnit={tempUnit}
              isDark={isDark}
            />

            {/* Row 4: Charts + 7-Day side-by-side on large screens */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <WeatherCharts
                weatherData={weatherData}
                tempUnit={tempUnit}
                isDark={isDark}
              />
              <WeeklyForecast
                weatherData={weatherData}
                tempUnit={tempUnit}
                isDark={isDark}
              />
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {showFavorites && (
        <FavoriteCities
          favorites={favorites}
          recentSearches={recentSearches}
          onCitySelect={handleCitySelect}
          onRemoveFavorite={removeFavorite}
          onClearRecent={clearRecent}
          onClose={() => setShowFavorites(false)}
          isDark={isDark}
        />
      )}

      {showSettings && (
        <SettingsModal
          isDark={isDark}
          toggleTheme={toggleTheme}
          tempUnit={tempUnit}
          toggleTempUnit={toggleTempUnit}
          windUnit={windUnit}
          setWindUnit={setWindUnit}
          pressureUnit={pressureUnit}
          setPressureUnit={setPressureUnit}
          reducedMotion={reducedMotion}
          setReducedMotion={setReducedMotion}
          clearAllData={clearAllData}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
};

export default App;
