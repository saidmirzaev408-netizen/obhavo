import React from 'react';
import { Wind, Leaf } from 'lucide-react';
import { getAQIInfo } from '../utils/weatherHelpers';

const AQI_POLLUTANTS = [
  { key: 'pm2_5', label: 'PM2.5', unit: 'μg/m³', max: 150 },
  { key: 'pm10', label: 'PM10', unit: 'μg/m³', max: 200 },
  { key: 'o3', label: 'Ozone', unit: 'μg/m³', max: 240 },
  { key: 'no2', label: 'NO₂', unit: 'μg/m³', max: 200 },
];

/**
 * AirQuality — AQI card with index display and individual pollutant bars.
 */
const AirQuality = ({ weatherData, isDark }) => {
  const aq = weatherData?.current?.air_quality;
  if (!aq) return null;

  const aqiIndex = aq['us-epa-index'];
  const info = getAQIInfo(aqiIndex ? aqiIndex * 25 : null); // Convert 1-6 scale to AQI approx

  return (
    <div className="glass-card p-5 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-sm font-semibold uppercase tracking-wider ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
          Air Quality
        </h2>
        <Leaf size={15} className="text-emerald-400" />
      </div>

      {/* AQI badge */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`text-3xl font-bold tabular-nums ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {aqiIndex || '--'}
          <span className={`text-xs font-normal ml-1 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>/ 6</span>
        </div>
        <div>
          <span className={`text-sm font-semibold ${info.color}`}>{info.label}</span>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>{info.desc}</p>
        </div>
      </div>

      {/* AQI bar */}
      <div className="progress-bar mb-4">
        <div
          className="progress-fill"
          style={{
            width: `${Math.min(100, ((aqiIndex || 1) / 6) * 100)}%`,
            background: aqiIndex <= 2
              ? '#10b981'
              : aqiIndex <= 3
              ? '#f59e0b'
              : aqiIndex <= 4
              ? '#f97316'
              : '#ef4444',
          }}
        />
      </div>

      {/* Pollutants */}
      <div className="grid grid-cols-2 gap-3">
        {AQI_POLLUTANTS.map((p) => {
          const val = aq[p.key];
          if (val == null) return null;
          const pct = Math.min(100, (val / p.max) * 100);
          return (
            <div key={p.key} className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <span className={`text-xs ${isDark ? 'text-white/45' : 'text-gray-500'}`}>{p.label}</span>
                <span className={`text-xs font-medium tabular-nums ${isDark ? 'text-white/70' : 'text-gray-700'}`}>
                  {val.toFixed(1)}
                  <span className={`text-[10px] ml-0.5 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>{p.unit}</span>
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${pct}%`,
                    background: pct > 75 ? '#ef4444' : pct > 50 ? '#f59e0b' : '#10b981',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AirQuality;
