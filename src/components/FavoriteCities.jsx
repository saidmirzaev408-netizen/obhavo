import React from 'react';
import { Heart, MapPin, X, Clock, Trash2 } from 'lucide-react';

/**
 * FavoriteCities — slide-in panel for saved and recently searched cities.
 */
const FavoriteCities = ({
  favorites,
  recentSearches,
  onCitySelect,
  onRemoveFavorite,
  onClearRecent,
  onClose,
  isDark,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div
        className="relative z-10 w-full max-w-sm h-full flex flex-col animate-slide-up"
        style={{
          background: isDark ? 'rgba(11,15,25,0.96)' : 'rgba(248,250,252,0.96)',
          backdropFilter: 'blur(24px)',
          borderLeft: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)' }}>
          <div className="flex items-center gap-2">
            <Heart size={16} className="text-rose-400" />
            <h2 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Saved Cities
            </h2>
          </div>
          <button
            id="close-favorites-btn"
            onClick={onClose}
            className="glass-btn p-1.5"
            aria-label="Close favorites"
          >
            <X size={15} className={isDark ? 'text-white/60' : 'text-gray-600'} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-5">
          {/* Favorites */}
          <div>
            <p className={`text-xs font-medium uppercase tracking-wider mb-3 ${isDark ? 'text-white/35' : 'text-gray-400'}`}>
              Favorites
            </p>
            {favorites.length === 0 ? (
              <div className={`text-center py-8 rounded-xl border ${isDark ? 'border-white/5 text-white/25' : 'border-gray-100 text-gray-400'}`}>
                <Heart size={28} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No favorite cities yet.</p>
                <p className="text-xs mt-1 opacity-70">Tap ♥ on any city to save it.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {favorites.map((city, i) => (
                  <div
                    key={`fav-${i}-${city.name}`}
                    className="flex items-center gap-3 glass-card px-4 py-3 group cursor-pointer"
                    onClick={() => { onCitySelect(city); onClose(); }}
                  >
                    <MapPin size={14} className="text-indigo-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        {city.name}
                      </div>
                      <div className={`text-xs truncate ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
                        {[city.region, city.country].filter(Boolean).join(', ')}
                      </div>
                    </div>
                    <button
                      id={`remove-fav-${i}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFavorite(city.name, city.country);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-rose-500/20"
                      aria-label={`Remove ${city.name} from favorites`}
                    >
                      <X size={12} className="text-rose-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-white/35' : 'text-gray-400'}`}>
                  Recent
                </p>
                <button
                  id="clear-recent-btn"
                  onClick={onClearRecent}
                  className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 transition-colors"
                  aria-label="Clear recent searches"
                >
                  <Trash2 size={11} />
                  Clear
                </button>
              </div>
              <div className="flex flex-col gap-1.5">
                {recentSearches.map((city, i) => (
                  <div
                    key={`recent-${i}-${city.name}`}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors duration-150"
                    style={{ ':hover': { background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' } }}
                    onClick={() => { onCitySelect(city); onClose(); }}
                  >
                    <Clock size={13} className={isDark ? 'text-white/30' : 'text-gray-400'} />
                    <span className={`text-sm truncate ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                      {city.name}, {city.country}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoriteCities;
