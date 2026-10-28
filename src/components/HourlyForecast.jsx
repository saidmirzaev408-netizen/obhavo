import React, { useRef } from 'react';
import {
  Sun, Cloud, CloudRain, CloudSnow, CloudLightning,
  CloudFog, CloudDrizzle, CloudRainWind, Snowflake, Moon, CloudMoon, CloudSun, SunMedium,
  Droplets, Wind, ChevronLeft, ChevronRight
} from 'lucide-react';
import { formatTemperature } from '../utils/temperature';
import { getWeatherInfo } from '../utils/weatherHelpers';

const ICON_MAP = {
  Sun, Cloud, CloudRain, CloudSnow, CloudLightning,
  CloudFog, CloudDrizzle, CloudRainWind, Snowflake, Moon, CloudMoon, CloudSun, SunMedium,
};
const getIcon = (name, size = 24) => {
  const C = ICON_MAP[name] || Cloud;
  return <C size={size} strokeWidth={1.5} />;
};

const HourCard = ({ hour, isNow, tempUnit, isDark }) => {
  const info = getWeatherInfo(hour?.condition?.code ?? 2, hour?.is_day ?? 1);
  const time = hour?.time?.split(' ')[1] || '';
  const displayTime = time
    ? (() => {
        const [h] = time.split(':').map(Number);
        return h === 0 ? '12 AM' : h === 12 ? '12 PM' : h < 12 ? `${h} AM` : `${h - 12} PM`;
      })()
    : '--';

  return (
    <div
      className={`glass-card flex flex-col items-center gap-1.5 px-4 py-3 flex-shrink-0 w-[88px] cursor-default transition-all duration-300 ${
        isNow ? 'glow-ring border-indigo-400/40' : ''
      }`}
    >
      <span className={`text-xs font-semibold ${isNow ? 'text-indigo-400' : isDark ? 'text-white/50' : 'text-gray-500'}`}>
        {isNow ? 'Now' : displayTime}
      </span>
      <div className={`${info.type === 'clear' ? 'text-yellow-300' : info.type === 'rain' ? 'text-blue-400' : 'text-white/70'}`}>
        {getIcon(info.icon, 24)}
      </div>
      <span className={`text-sm font-bold tabular-nums ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {formatTemperature(hour?.temp_c, tempUnit)}
      </span>
      <div className="flex items-center gap-0.5">
        <Droplets size={10} className="text-blue-400" />
        <span className={`text-[10px] ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
          {hour?.chance_of_rain ?? 0}%
        </span>
      </div>
    </div>
  );
};

/**
 * HourlyForecast — horizontally scrollable carousel for next 24 hours.
 */
const HourlyForecast = ({ weatherData, tempUnit, isDark }) => {
  const hours = weatherData?.forecast?.forecastday?.[0]?.hour || [];
  const containerRef = useRef(null);

  const currentHour = new Date().getHours();

  const scroll = (dir) => {
    if (!containerRef.current) return;
    containerRef.current.scrollBy({ left: dir * 300, behavior: 'smooth' });
  };

  if (!hours.length) return null;

  return (
    <section aria-label="Hourly forecast" className="animate-slide-up">
      <div className="flex items-center justify-between mb-3">
        <h2 className={`text-sm font-semibold uppercase tracking-wider ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
          Hourly Forecast
        </h2>
        <div className="flex gap-1.5">
          <button
            id="hourly-scroll-left"
            onClick={() => scroll(-1)}
            className="glass-btn p-1.5"
            aria-label="Scroll left"
          >
            <ChevronLeft size={14} className={isDark ? 'text-white/60' : 'text-gray-600'} />
          </button>
          <button
            id="hourly-scroll-right"
            onClick={() => scroll(1)}
            className="glass-btn p-1.5"
            aria-label="Scroll right"
          >
            <ChevronRight size={14} className={isDark ? 'text-white/60' : 'text-gray-600'} />
          </button>
        </div>
      </div>
      <div
        ref={containerRef}
        className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 snap-x snap-mandatory"
      >
        {hours.map((hour, idx) => {
          const h = parseInt(hour?.time?.split(' ')[1]?.split(':')[0] ?? idx, 10);
          return (
            <div key={`hour-${idx}`} className="snap-start">
              <HourCard
                hour={hour}
                isNow={h === currentHour}
                tempUnit={tempUnit}
                isDark={isDark}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HourlyForecast;
