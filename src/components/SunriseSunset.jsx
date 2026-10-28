import React, { useEffect, useState } from 'react';
import { Sunrise, Sunset, Moon } from 'lucide-react';

const parseTime = (timeStr) => {
  // WeatherAPI returns "06:32 AM" format
  if (!timeStr) return null;
  const [time, period] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

const SunArc = ({ sunriseMin, sunsetMin, isDark }) => {
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const pct = Math.max(0, Math.min(1, (nowMin - sunriseMin) / (sunsetMin - sunriseMin)));
  const angle = pct * Math.PI;

  const cx = 100, cy = 70, r = 60;
  const x = cx + r * Math.cos(Math.PI - angle);
  const y = cy - r * Math.sin(angle);

  return (
    <svg viewBox="0 0 200 80" className="w-full" aria-hidden="true">
      {/* Arc path */}
      <path
        d={`M ${cx - r},${cy} A ${r},${r} 0 0,1 ${cx + r},${cy}`}
        fill="none"
        stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}
        strokeWidth="2"
      />
      {/* Filled progress arc */}
      {pct > 0 && pct < 1 && (
        <path
          d={`M ${cx - r},${cy} A ${r},${r} 0 0,1 ${x},${y}`}
          fill="none"
          stroke="url(#sunGrad)"
          strokeWidth="2"
        />
      )}
      <defs>
        <linearGradient id="sunGrad" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#f59e0b" />
          <stop offset="1" stopColor="#fb923c" />
        </linearGradient>
      </defs>
      {/* Horizon line */}
      <line x1={cx - r - 10} y1={cy} x2={cx + r + 10} y2={cy}
        stroke={isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)'}
        strokeWidth="1" />
      {/* Sun marker */}
      {pct > 0 && pct < 1 && (
        <circle cx={x} cy={y} r="5" fill="#fbbf24"
          style={{ filter: 'drop-shadow(0 0 8px rgba(251,191,36,0.8))' }} />
      )}
    </svg>
  );
};

/**
 * SunriseSunset — glassmorphism card with visual sun arc and moon phase.
 */
const SunriseSunset = ({ weatherData, isDark }) => {
  const astro = weatherData?.forecast?.forecastday?.[0]?.astro;
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick((v) => v + 1), 60000);
    return () => clearInterval(t);
  }, []);

  if (!astro) return null;

  const sunriseMin = parseTime(astro.sunrise) ?? 360;
  const sunsetMin = parseTime(astro.sunset) ?? 1140;

  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const daylightPct = Math.max(0, Math.min(100, Math.round(
    ((nowMin - sunriseMin) / (sunsetMin - sunriseMin)) * 100
  )));

  // Moon phase emoji
  const moonEmoji = {
    'New Moon': '🌑',
    'Waxing Crescent': '🌒',
    'First Quarter': '🌓',
    'Waxing Gibbous': '🌔',
    'Full Moon': '🌕',
    'Waning Gibbous': '🌖',
    'Last Quarter': '🌗',
    'Waning Crescent': '🌘',
  }[astro.moon_phase] || '🌙';

  return (
    <div className="glass-card p-5 animate-slide-up">
      <h2 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
        Sun & Moon
      </h2>

      {/* Sun arc */}
      <SunArc sunriseMin={sunriseMin} sunsetMin={sunsetMin} isDark={isDark} />

      {/* Sunrise / Sunset row */}
      <div className="flex justify-between mt-2 mb-4">
        <div className="flex flex-col items-center gap-1">
          <Sunrise size={18} className="text-orange-400" />
          <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {astro.sunrise}
          </span>
          <span className={`text-xs ${isDark ? 'text-white/40' : 'text-gray-400'}`}>Sunrise</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="text-xs font-medium px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(251,191,36,0.12)', color: '#fbbf24' }}>
            {nowMin >= sunriseMin && nowMin <= sunsetMin ? `${daylightPct}% daylight` : 'Nighttime'}
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Sunset size={18} className="text-indigo-400" />
          <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {astro.sunset}
          </span>
          <span className={`text-xs ${isDark ? 'text-white/40' : 'text-gray-400'}`}>Sunset</span>
        </div>
      </div>

      {/* Moon info */}
      {astro.moon_phase && (
        <div className="flex items-center gap-3 pt-3 border-t"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <span className="text-2xl">{moonEmoji}</span>
          <div>
            <div className={`text-sm font-medium ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
              {astro.moon_phase}
            </div>
            {astro.moon_illumination && (
              <div className={`text-xs ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                {astro.moon_illumination}% illuminated
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SunriseSunset;
