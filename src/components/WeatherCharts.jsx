import React, { useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine, Area, AreaChart, Legend
} from 'recharts';
import { formatTemperature } from '../utils/temperature';

// ─── Shared tooltip ─────────────────────────────────────────────────────────
const GlassTooltip = ({ active, payload, label, isDark, unit = '' }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl px-3 py-2 text-sm border"
      style={{
        background: isDark ? 'rgba(15,23,42,0.92)' : 'rgba(255,255,255,0.92)',
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
      }}
    >
      <p className={`font-semibold mb-1 ${isDark ? 'text-white/60' : 'text-gray-500'}`}>{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className={isDark ? 'text-white' : 'text-gray-800'}>
            {p.value}{unit}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── Hourly Temp Chart ───────────────────────────────────────────────────────
const HourlyTempChart = ({ hours, tempUnit, isDark }) => {
  const data = hours.map((h) => ({
    time: h.time?.split(' ')[1]?.slice(0, 5) || '',
    temp: tempUnit === 'F'
      ? Math.round((h.temp_c * 9) / 5 + 32)
      : Math.round(h.temp_c),
  }));

  const displayEvery = (idx) => idx % 3 === 0;

  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} />
        <XAxis
          dataKey="time"
          tick={{ fill: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v, i) => displayEvery(i) ? v : ''}
          interval={0}
        />
        <YAxis
          tick={{ fill: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${v}°`}
        />
        <Tooltip content={<GlassTooltip isDark={isDark} unit={`°${tempUnit}`} />} />
        <Area
          type="monotone"
          dataKey="temp"
          stroke="#818cf8"
          strokeWidth={2}
          fill="url(#tempGrad)"
          dot={false}
          activeDot={{ r: 4, fill: '#818cf8', strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

// ─── Precipitation Chart ─────────────────────────────────────────────────────
const PrecipChart = ({ hours, isDark }) => {
  const data = hours.map((h) => ({
    time: h.time?.split(' ')[1]?.slice(0, 5) || '',
    rain: h.chance_of_rain ?? 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} />
        <XAxis
          dataKey="time"
          tick={{ fill: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v, i) => i % 3 === 0 ? v : ''}
          interval={0}
        />
        <YAxis
          tick={{ fill: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          domain={[0, 100]}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip content={<GlassTooltip isDark={isDark} unit="%" />} />
        <Bar dataKey="rain" fill="#60a5fa" radius={[2, 2, 0, 0]} maxBarSize={10} />
      </BarChart>
    </ResponsiveContainer>
  );
};

// ─── Weekly Temp Chart ───────────────────────────────────────────────────────
const WeeklyTempChart = ({ forecast, tempUnit, isDark }) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const data = forecast.map((d, i) => {
    const date = new Date(d.date + 'T12:00:00');
    return {
      day: i === 0 ? 'Today' : days[date.getDay()],
      high: tempUnit === 'F' ? Math.round((d.day.maxtemp_c * 9) / 5 + 32) : Math.round(d.day.maxtemp_c),
      low: tempUnit === 'F' ? Math.round((d.day.mintemp_c * 9) / 5 + 32) : Math.round(d.day.mintemp_c),
    };
  });

  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} />
        <XAxis dataKey="day" tick={{ fill: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontSize: 10 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fill: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}°`} />
        <Tooltip content={<GlassTooltip isDark={isDark} unit={`°${tempUnit}`} />} />
        <Legend
          wrapperStyle={{ fontSize: 11, color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}
        />
        <Line type="monotone" dataKey="high" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 3, strokeWidth: 0 }} activeDot={{ r: 5, strokeWidth: 0 }} name="High" />
        <Line type="monotone" dataKey="low" stroke="#60a5fa" strokeWidth={2} dot={{ fill: '#60a5fa', r: 3, strokeWidth: 0 }} activeDot={{ r: 5, strokeWidth: 0 }} name="Low" />
      </LineChart>
    </ResponsiveContainer>
  );
};

/**
 * WeatherCharts — three glass-panel charts using Recharts.
 */
const WeatherCharts = ({ weatherData, tempUnit, isDark }) => {
  const [activeTab, setActiveTab] = useState('temp');
  const hours = weatherData?.forecast?.forecastday?.[0]?.hour || [];
  const forecastDays = weatherData?.forecast?.forecastday || [];

  const tabs = [
    { id: 'temp', label: 'Temperature' },
    { id: 'precip', label: 'Precipitation' },
    { id: 'weekly', label: '7-Day' },
  ];

  const hasData = hours.length > 0 || forecastDays.length > 0;

  return (
    <section aria-label="Weather charts">
      <div className="glass-card p-5 animate-slide-up">
        {/* Tab bar */}
        <div className="flex items-center justify-between mb-5">
          <h2 className={`text-sm font-semibold uppercase tracking-wider ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
            Charts
          </h2>
          <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                id={`chart-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-indigo-500/80 text-white shadow-sm'
                    : isDark ? 'text-white/50 hover:text-white/70' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {!hasData ? (
          <div className={`text-center py-10 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
            No chart data available
          </div>
        ) : (
          <div className="animate-fade-in" key={activeTab}>
            {activeTab === 'temp' && hours.length > 0 && (
              <HourlyTempChart hours={hours} tempUnit={tempUnit} isDark={isDark} />
            )}
            {activeTab === 'precip' && hours.length > 0 && (
              <PrecipChart hours={hours} isDark={isDark} />
            )}
            {activeTab === 'weekly' && forecastDays.length > 0 && (
              <WeeklyTempChart forecast={forecastDays} tempUnit={tempUnit} isDark={isDark} />
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default WeatherCharts;
