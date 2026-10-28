import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

/**
 * WeatherAlerts — displays official weather alert cards from the API.
 * Only shown when real alerts are returned by the provider.
 */
const WeatherAlerts = ({ weatherData, isDark }) => {
  const alerts = weatherData?.alerts?.alert || [];
  if (!alerts.length) return null;

  return (
    <section aria-label="Weather alerts">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle size={15} className="text-amber-400" />
        <h2 className={`text-sm font-semibold uppercase tracking-wider ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
          Weather Alerts ({alerts.length})
        </h2>
      </div>
      <div className="flex flex-col gap-3">
        {alerts.map((alert, i) => (
          <div
            key={i}
            className="rounded-2xl border p-4 animate-slide-up"
            style={{
              background: 'rgba(245,158,11,0.08)',
              borderColor: 'rgba(245,158,11,0.3)',
              animationDelay: `${i * 50}ms`,
            }}
          >
            <div className="flex items-start gap-3">
              <AlertTriangle size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {alert.headline || alert.event || 'Weather Alert'}
                </div>
                {alert.msgtype && (
                  <div className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full mb-2"
                    style={{ background: 'rgba(245,158,11,0.2)', color: '#f59e0b' }}>
                    {alert.msgtype}
                  </div>
                )}
                {alert.desc && (
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-white/55' : 'text-gray-500'}`}>
                    {alert.desc.slice(0, 300)}{alert.desc.length > 300 ? '…' : ''}
                  </p>
                )}
                {(alert.effective || alert.expires) && (
                  <div className={`flex gap-4 mt-2 text-xs ${isDark ? 'text-white/35' : 'text-gray-400'}`}>
                    {alert.effective && <span>From: {new Date(alert.effective).toLocaleString()}</span>}
                    {alert.expires && <span>Until: {new Date(alert.expires).toLocaleString()}</span>}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WeatherAlerts;
