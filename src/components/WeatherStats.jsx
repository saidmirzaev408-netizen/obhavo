import React from 'react';
import {
  Droplets, Wind, Compass, Gauge, Eye, Sun, Cloud,
  Thermometer, CloudRain, ArrowUp
} from 'lucide-react';
import { formatWindSpeed, formatPressure, formatVisibility, getWindDirection, getUVGuidance } from '../utils/temperature';

const StatCard = ({ icon: Icon, title, value, unit, detail, progress, progressColor, isDark, accentColor = 'text-indigo-400', delay = 0 }) => (
  <div
    className="glass-card p-4 flex flex-col gap-2 animate-slide-up"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-center justify-between">
      <span className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-white/45' : 'text-gray-500'}`}>
        {title}
      </span>
      <Icon size={15} className={accentColor} />
    </div>
    <div className={`text-2xl font-bold tabular-nums ${isDark ? 'text-white' : 'text-gray-900'}`}>
      {value}
      {unit && (
        <span className={`text-sm font-normal ml-1 ${isDark ? 'text-white/45' : 'text-gray-500'}`}>
          {unit}
        </span>
      )}
    </div>
    {detail && (
      <p className={`text-xs ${isDark ? 'text-white/40' : 'text-gray-400'}`}>{detail}</p>
    )}
    {progress !== undefined && (
      <div className="progress-bar mt-1">
        <div
          className={`progress-fill ${progressColor || 'bg-indigo-500'}`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    )}
  </div>
);

/**
 * WeatherStats — 9-card detailed weather statistics grid.
 */
const WeatherStats = ({ weatherData, tempUnit, windUnit, pressureUnit, isDark }) => {
  const c = weatherData?.current;
  if (!c) return null;

  const uvInfo = getUVGuidance(c.uv);

  const stats = [
    {
      icon: Droplets,
      title: 'Humidity',
      value: c.humidity ?? '--',
      unit: '%',
      detail: c.humidity > 70 ? 'Feels muggy' : c.humidity < 30 ? 'Quite dry' : 'Comfortable',
      progress: c.humidity,
      progressColor: 'bg-blue-400',
      accentColor: 'text-blue-400',
    },
    {
      icon: Wind,
      title: 'Wind Speed',
      value: formatWindSpeed(c.wind_kph, windUnit).split(' ')[0],
      unit: windUnit,
      detail: `Gusts up to ${formatWindSpeed(c.gust_kph, windUnit)}`,
      progress: Math.min(100, (c.wind_kph / 120) * 100),
      progressColor: 'bg-cyan-400',
      accentColor: 'text-cyan-400',
    },
    {
      icon: Compass,
      title: 'Wind Direction',
      value: c.wind_dir || getWindDirection(c.wind_degree),
      unit: '',
      detail: `${c.wind_degree ?? '--'}° from North`,
      accentColor: 'text-teal-400',
    },
    {
      icon: Gauge,
      title: 'Pressure',
      value: formatPressure(c.pressure_mb, pressureUnit).split(' ')[0],
      unit: pressureUnit,
      detail: c.pressure_mb > 1013 ? 'High pressure' : 'Low pressure',
      progress: Math.min(100, ((c.pressure_mb - 950) / 100) * 100),
      progressColor: 'bg-violet-400',
      accentColor: 'text-violet-400',
    },
    {
      icon: Eye,
      title: 'Visibility',
      value: formatVisibility((c.vis_km ?? c.visibility) * 1000, 'km').split(' ')[0],
      unit: 'km',
      detail: c.vis_km >= 10 ? 'Clear visibility' : c.vis_km >= 5 ? 'Good' : 'Reduced',
      progress: Math.min(100, ((c.vis_km ?? c.visibility) / 20) * 100),
      progressColor: 'bg-emerald-400',
      accentColor: 'text-emerald-400',
    },
    {
      icon: Sun,
      title: 'UV Index',
      value: c.uv ?? '--',
      unit: '',
      detail: uvInfo.label,
      progress: Math.min(100, ((c.uv ?? 0) / 12) * 100),
      progressColor: c.uv > 7 ? 'bg-rose-500' : c.uv > 4 ? 'bg-orange-400' : 'bg-yellow-400',
      accentColor: uvInfo.color,
    },
    {
      icon: Cloud,
      title: 'Cloud Cover',
      value: c.cloud ?? '--',
      unit: '%',
      detail: c.cloud > 75 ? 'Overcast' : c.cloud > 40 ? 'Partly cloudy' : 'Mostly clear',
      progress: c.cloud,
      progressColor: 'bg-slate-400',
      accentColor: 'text-slate-400',
    },
    {
      icon: Thermometer,
      title: 'Dew Point',
      value: tempUnit === 'F'
        ? `${Math.round((c.dewpoint_c * 9) / 5 + 32)}`
        : `${Math.round(c.dewpoint_c ?? 0)}`,
      unit: `°${tempUnit}`,
      detail: c.dewpoint_c > 16 ? 'Humid' : c.dewpoint_c > 10 ? 'Comfortable' : 'Dry',
      accentColor: 'text-rose-400',
    },
    {
      icon: CloudRain,
      title: 'Precipitation',
      value: c.precip_mm ?? 0,
      unit: 'mm',
      detail: `${weatherData?.forecast?.forecastday?.[0]?.day?.daily_chance_of_rain ?? '--'}% chance of rain`,
      progress: Math.min(100, ((c.precip_mm ?? 0) / 50) * 100),
      progressColor: 'bg-blue-500',
      accentColor: 'text-blue-400',
    },
  ];

  return (
    <section aria-label="Detailed weather statistics">
      <h2 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
        Weather Details
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {stats.map((s, i) => (
          <StatCard key={s.title} {...s} isDark={isDark} delay={i * 40} />
        ))}
      </div>
    </section>
  );
};

export default WeatherStats;
