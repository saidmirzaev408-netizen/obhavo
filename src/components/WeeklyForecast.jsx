import React, { useState } from 'react';
import {
  Sun, Cloud, CloudRain, CloudSnow, CloudLightning,
  CloudFog, CloudDrizzle, CloudRainWind, Snowflake, Moon, CloudMoon, CloudSun, SunMedium,
  ChevronDown, ChevronUp, Droplets, Wind
} from 'lucide-react';
import { formatTemperature } from '../utils/temperature';
import { getWeatherInfo } from '../utils/weatherHelpers';

const ICON_MAP = {
  Sun, Cloud, CloudRain, CloudSnow, CloudLightning,
  CloudFog, CloudDrizzle, CloudRainWind, Snowflake, Moon, CloudMoon, CloudSun, SunMedium,
};
const getIcon = (name, size = 22) => {
  const C = ICON_MAP[name] || Cloud;
  return <C size={size} strokeWidth={1.5} />;
};

const getDayLabel = (dateStr, idx) => {
  if (idx === 0) return 'Today';
  if (idx === 1) return 'Tomorrow';
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const d = new Date(dateStr + 'T12:00:00');
  return days[d.getDay()];
};

const getDateLabel = (dateStr) => {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const ForecastRow = ({ day, idx, tempUnit, isDark, globalMin, globalMax }) => {
  const [expanded, setExpanded] = useState(false);
  const info = getWeatherInfo(day?.day?.condition?.code ?? 2, 1);
  const iconColor = {
    clear: 'text-yellow-300',
    rain: 'text-blue-400',
    snow: 'text-cyan-300',
    thunder: 'text-purple-400',
    fog: 'text-slate-400',
    cloudy: 'text-blue-200',
  }[info.type] || 'text-white/70';

  // Temp bar range
  const range = globalMax - globalMin || 1;
  const barStart = ((day.day.mintemp_c - globalMin) / range) * 100;
  const barWidth = ((day.day.maxtemp_c - day.day.mintemp_c) / range) * 100;

  return (
    <div className="glass-card overflow-hidden animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
      <button
        id={`forecast-row-${idx}`}
        className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors duration-150"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-label={`${getDayLabel(day.date, idx)} forecast, click to expand`}
      >
        {/* Day label */}
        <div className="flex flex-col items-start w-20 flex-shrink-0">
          <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {getDayLabel(day.date, idx)}
          </span>
          <span className={`text-xs ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
            {getDateLabel(day.date)}
          </span>
        </div>

        {/* Icon + condition */}
        <div className={`flex-shrink-0 ${iconColor}`}>
          {getIcon(info.icon, 20)}
        </div>
        <span className={`hidden sm:block text-xs flex-1 min-w-0 truncate text-left ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
          {day.day.condition?.text}
        </span>

        {/* Precipitation */}
        <div className="flex items-center gap-1 flex-shrink-0 w-12 justify-end">
          {day.day.daily_chance_of_rain > 0 && (
            <>
              <Droplets size={11} className="text-blue-400" />
              <span className={`text-xs tabular-nums ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                {day.day.daily_chance_of_rain}%
              </span>
            </>
          )}
        </div>

        {/* Temp range bar */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-xs tabular-nums w-10 text-right ${isDark ? 'text-blue-300/70' : 'text-blue-500'}`}>
            {formatTemperature(day.day.mintemp_c, tempUnit)}
          </span>
          <div className="w-20 h-1.5 rounded-full relative" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div
              className="absolute h-full rounded-full"
              style={{
                left: `${barStart}%`,
                width: `${barWidth}%`,
                background: 'linear-gradient(90deg, #60a5fa, #f59e0b)',
              }}
            />
          </div>
          <span className={`text-xs tabular-nums w-10 ${isDark ? 'text-rose-300/70' : 'text-rose-500'}`}>
            {formatTemperature(day.day.maxtemp_c, tempUnit)}
          </span>
        </div>

        {/* Expand toggle */}
        <div className={`flex-shrink-0 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="px-4 pb-4 pt-1 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          {[
            { label: 'Avg Temp', value: formatTemperature(day.day.avgtemp_c, tempUnit) },
            { label: 'Max Wind', value: `${day.day.maxwind_kph} km/h` },
            { label: 'Humidity', value: `${day.day.avghumidity}%` },
            { label: 'Total Precip', value: `${day.day.totalprecip_mm} mm` },
          ].map((item) => (
            <div key={item.label} className="flex flex-col gap-0.5">
              <span className={`text-xs ${isDark ? 'text-white/35' : 'text-gray-400'}`}>{item.label}</span>
              <span className={`text-sm font-semibold ${isDark ? 'text-white/80' : 'text-gray-800'}`}>{item.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * WeeklyForecast — 7-day forecast with expandable rows and temp-range bars.
 */
const WeeklyForecast = ({ weatherData, tempUnit, isDark }) => {
  const days = weatherData?.forecast?.forecastday || [];
  if (!days.length) return null;

  const allMin = Math.min(...days.map((d) => d.day.mintemp_c));
  const allMax = Math.max(...days.map((d) => d.day.maxtemp_c));

  return (
    <section aria-label="7-day weather forecast">
      <h2 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
        7-Day Forecast
      </h2>
      <div className="flex flex-col gap-2">
        {days.map((day, idx) => (
          <ForecastRow
            key={day.date}
            day={day}
            idx={idx}
            tempUnit={tempUnit}
            isDark={isDark}
            globalMin={allMin}
            globalMax={allMax}
          />
        ))}
      </div>
    </section>
  );
};

export default WeeklyForecast;
