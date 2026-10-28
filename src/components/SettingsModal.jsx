import React from 'react';
import { X, Settings, Wind, Thermometer, Gauge, Eye, Trash2, Activity, Info } from 'lucide-react';
import { getIsDemoMode } from '../services/weatherService';

const ToggleRow = ({ label, description, checked, onChange, id, isDark }) => (
  <div className="flex items-start justify-between gap-4 py-3 border-b last:border-0"
    style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
    <div className="flex-1 min-w-0">
      <div className={`text-sm font-medium ${isDark ? 'text-white/85' : 'text-gray-800'}`}>{label}</div>
      {description && (
        <div className={`text-xs mt-0.5 ${isDark ? 'text-white/35' : 'text-gray-400'}`}>{description}</div>
      )}
    </div>
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 ${checked ? 'bg-indigo-500' : isDark ? 'bg-white/15' : 'bg-gray-200'}`}
    >
      <div className={`absolute top-1 w-4 h-4 rounded-full transition-transform duration-200 ${isDark ? 'bg-white' : 'bg-white'} shadow-sm ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  </div>
);

const SelectRow = ({ label, value, options, onChange, id, isDark }) => (
  <div className="flex items-center justify-between gap-4 py-3 border-b last:border-0"
    style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
    <div className={`text-sm font-medium ${isDark ? 'text-white/85' : 'text-gray-800'}`}>{label}</div>
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`text-xs rounded-lg px-2.5 py-1.5 border outline-none cursor-pointer transition-colors ${
        isDark
          ? 'bg-white/8 border-white/12 text-white/80'
          : 'bg-white border-gray-200 text-gray-700'
      }`}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  </div>
);

/**
 * SettingsModal — full settings panel with unit toggles, theme, reduced motion, and clear data.
 */
const SettingsModal = ({
  isDark, toggleTheme,
  tempUnit, toggleTempUnit,
  windUnit, setWindUnit,
  pressureUnit, setPressureUnit,
  reducedMotion, setReducedMotion,
  clearAllData,
  onClose,
}) => {
  const isDemoMode = getIsDemoMode();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div
        className="relative z-10 w-full max-w-md rounded-2xl border flex flex-col max-h-[90vh] overflow-hidden animate-slide-up"
        style={{
          background: isDark ? 'rgba(11,15,25,0.97)' : 'rgba(248,250,252,0.97)',
          borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
          style={{ borderColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)' }}>
          <div className="flex items-center gap-2">
            <Settings size={16} className="text-indigo-400" />
            <h2 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Settings</h2>
          </div>
          <button
            id="close-settings-btn"
            onClick={onClose}
            className="glass-btn p-1.5"
            aria-label="Close settings"
          >
            <X size={15} className={isDark ? 'text-white/60' : 'text-gray-600'} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">

          {/* Demo Mode Banner */}
          {isDemoMode && (
            <div className="rounded-xl p-3 flex gap-3"
              style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)' }}>
              <Info size={16} className="text-indigo-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className={`text-xs font-medium mb-1 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                  Demo Mode Active
                </div>
                <div className={`text-xs ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                  Add <code className="px-1 rounded" style={{ background: 'rgba(255,255,255,0.1)' }}>VITE_WEATHER_API_KEY</code> to{' '}
                  <code className="px-1 rounded" style={{ background: 'rgba(255,255,255,0.1)' }}>.env.local</code> to enable real weather data.
                  Get a free key at{' '}
                  <a href="https://www.weatherapi.com" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
                    weatherapi.com
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Appearance */}
          <div>
            <p className={`text-xs font-medium uppercase tracking-wider mb-2 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
              Appearance
            </p>
            <div className="glass-card px-4">
              <ToggleRow
                id="dark-mode-toggle"
                label="Dark Mode"
                description="Toggle between dark and light theme"
                checked={isDark}
                onChange={toggleTheme}
                isDark={isDark}
              />
              <ToggleRow
                id="reduced-motion-toggle"
                label="Reduce Motion"
                description="Minimise animations for accessibility"
                checked={reducedMotion}
                onChange={setReducedMotion}
                isDark={isDark}
              />
            </div>
          </div>

          {/* Units */}
          <div>
            <p className={`text-xs font-medium uppercase tracking-wider mb-2 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
              Units
            </p>
            <div className="glass-card px-4">
              <SelectRow
                id="temp-unit-select"
                label="Temperature"
                value={tempUnit}
                onChange={toggleTempUnit}
                options={[{ value: 'C', label: '°C — Celsius' }, { value: 'F', label: '°F — Fahrenheit' }]}
                isDark={isDark}
              />
              <SelectRow
                id="wind-unit-select"
                label="Wind Speed"
                value={windUnit}
                onChange={setWindUnit}
                options={[
                  { value: 'km/h', label: 'km/h' },
                  { value: 'mph', label: 'mph' },
                  { value: 'm/s', label: 'm/s' },
                ]}
                isDark={isDark}
              />
              <SelectRow
                id="pressure-unit-select"
                label="Pressure"
                value={pressureUnit}
                onChange={setPressureUnit}
                options={[
                  { value: 'hPa', label: 'hPa' },
                  { value: 'inHg', label: 'inHg' },
                  { value: 'mmHg', label: 'mmHg' },
                ]}
                isDark={isDark}
              />
            </div>
          </div>

          {/* Data */}
          <div>
            <p className={`text-xs font-medium uppercase tracking-wider mb-2 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
              Data
            </p>
            <button
              id="clear-data-btn"
              onClick={() => {
                if (window.confirm('Clear all saved favorites, recent searches, and preferences?')) {
                  clearAllData();
                  onClose();
                }
              }}
              className="w-full glass-card px-4 py-3 flex items-center gap-3 hover:bg-rose-500/10 transition-colors duration-200 text-left"
            >
              <Trash2 size={15} className="text-rose-400" />
              <div>
                <div className={`text-sm font-medium ${isDark ? 'text-white/80' : 'text-gray-800'}`}>
                  Clear All Saved Data
                </div>
                <div className={`text-xs ${isDark ? 'text-white/35' : 'text-gray-400'}`}>
                  Remove favorites, recent searches & preferences
                </div>
              </div>
            </button>
          </div>

          {/* Version */}
          <p className={`text-xs text-center pt-2 ${isDark ? 'text-white/20' : 'text-gray-300'}`}>
            SkyCast Glass v1.0 · Weather data by WeatherAPI.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
