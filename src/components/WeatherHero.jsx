import React, { useMemo } from 'react';
import {
  Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog,
  CloudDrizzle, CloudRainWind, Snowflake, Moon, CloudMoon, CloudSun,
  SunMedium, ArrowUp, ArrowDown, Thermometer, Heart, HeartOff,
  Clock, MapPin, Wind, Droplets
} from 'lucide-react';
import { formatTemperature } from '../utils/temperature';
import { getWeatherInfo, formatWeatherDate, formatTime } from '../utils/weatherHelpers';

const ICON_MAP = {
  Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog,
  CloudDrizzle, CloudRainWind, Snowflake, Moon, CloudMoon, CloudSun,
  SunMedium,
};

const getIcon = (name, size = 64) => {
  const Comp = ICON_MAP[name] || Cloud;
  return <Comp size={size} strokeWidth={1.5} />;
};

/**
 * WeatherHero — the large atmospheric hero card with current conditions.
 */
const WeatherHero = ({ weatherData, tempUnit, isDark, isFavorite, onFavoriteToggle }) => {
  const { location, current } = weatherData;
  const info = useMemo(
    () => getWeatherInfo(current?.condition?.code ?? 2, current?.is_day ?? 1),
    [current?.condition?.code, current?.is_day]
  );

  const timezone = location?.tz_id || 'UTC';
  const dateStr = formatWeatherDate(location?.localtime?.replace(' ', 'T') ?? new Date().toISOString(), timezone);
  const timeStr = formatTime(location?.localtime?.replace(' ', 'T') ?? new Date().toISOString(), timezone);
  const lastUpdated = current?.last_updated
    ? formatTime(current.last_updated.replace(' ', 'T'), timezone)
    : '--';

  const today = weatherData?.forecast?.forecastday?.[0]?.day;

  // Weather-type icon color themes
  const iconColorMap = {
    clear: 'text-yellow-300 drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]',
    cloudy: 'text-blue-200 drop-shadow-[0_0_15px_rgba(191,219,254,0.3)]',
    rain: 'text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.4)]',
    snow: 'text-cyan-200 drop-shadow-[0_0_15px_rgba(165,243,252,0.4)]',
    thunder: 'text-purple-300 drop-shadow-[0_0_20px_rgba(196,181,253,0.5)]',
    fog: 'text-slate-300',
    night: 'text-indigo-200 drop-shadow-[0_0_20px_rgba(199,210,254,0.4)]',
  };
  const iconColor = info.type === 'clear' && !current?.is_day
    ? iconColorMap.night
    : iconColorMap[info.type] || 'text-white/80';

  return (
    <div className="glass-card p-6 md:p-8 relative overflow-hidden group animate-slide-up">
      {/* Ambient orb */}
      <div
        className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-30 group-hover:opacity-40 transition-opacity duration-700"
        style={{ background: info.type === 'rain' ? '#3b82f6' : info.type === 'thunder' ? '#7c3aed' : '#818cf8' }}
      />

      <div className="relative z-10 flex flex-col gap-5">

        {/* Header row */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <MapPin size={14} className="text-indigo-400 flex-shrink-0" />
              <h1 className={`text-xl md:text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {location?.name}
                {location?.country && (
                  <span className={`ml-1.5 text-sm font-normal ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                    {location.country}
                  </span>
                )}
              </h1>
            </div>
            <p className={`text-sm ${isDark ? 'text-white/50' : 'text-gray-500'}`}>{dateStr}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Clock size={11} className="text-white/40" />
              <span className={isDark ? 'text-white/55' : 'text-gray-500'}>Updated {lastUpdated}</span>
            </div>
            <button
              id="hero-favorite-btn"
              onClick={onFavoriteToggle}
              className="glass-btn p-2"
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFavorite
                ? <Heart size={16} className="text-rose-400 fill-rose-400" />
                : <Heart size={16} className="text-white/50 hover:text-rose-400 transition-colors" />
              }
            </button>
          </div>
        </div>

        {/* Main weather display */}
        <div className="flex flex-wrap items-center gap-6 md:gap-8">

          {/* Icon */}
          <div className={`${iconColor} animate-float flex-shrink-0`}>
            {getIcon(info.icon, 72)}
          </div>

          {/* Temperature + condition */}
          <div className="flex flex-col">
            <div className={`text-7xl md:text-8xl font-light tabular-nums leading-none ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {formatTemperature(current?.temp_c, tempUnit)}
            </div>
            <div className={`text-base mt-1 font-medium ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
              {current?.condition?.text || info.label}
            </div>
            <div className={`text-sm mt-0.5 flex items-center gap-1 ${isDark ? 'text-white/45' : 'text-gray-500'}`}>
              <Thermometer size={12} />
              Feels like {formatTemperature(current?.feelslike_c, tempUnit)}
            </div>
          </div>

          {/* Stats mini-grid */}
          <div className="flex flex-col gap-2 ml-auto">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <ArrowUp size={14} className="text-rose-400" />
                <span className={`text-sm font-semibold ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                  {formatTemperature(today?.maxtemp_c, tempUnit)}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <ArrowDown size={14} className="text-blue-400" />
                <span className={`text-sm font-semibold ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                  {formatTemperature(today?.mintemp_c, tempUnit)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Wind size={13} className="text-cyan-400" />
              <span className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                {current?.wind_kph ?? '--'} km/h {current?.wind_dir ?? ''}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Droplets size={13} className="text-blue-400" />
              <span className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                {current?.humidity ?? '--'}% Humidity
              </span>
            </div>
            <div className={`text-xs mt-1 ${isDark ? 'text-white/35' : 'text-gray-400'}`}>
              {timeStr} local time
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherHero;
