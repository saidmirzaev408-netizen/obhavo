import React, { useRef, useEffect } from 'react';
import { Search, Loader2, MapPin, X } from 'lucide-react';
import { useCitySearch } from '../hooks/useCitySearch';

/**
 * CitySearch — translucent search bar with autocomplete dropdown.
 */
const CitySearch = ({ onCitySelect, isDark }) => {
  const {
    query, setQuery,
    suggestions, searchLoading,
    isOpen, setIsOpen,
    highlightIndex,
    handleKeyDown,
    selectCity,
    clear,
    inputRef,
  } = useCitySearch(onCitySelect);

  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        inputRef.current && !inputRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [setIsOpen, inputRef]);

  return (
    <div className="relative flex-1 max-w-md" role="search">
      <label htmlFor="city-search-input" className="sr-only">Search for a city</label>
      <div className="relative flex items-center">
        <span className="absolute left-3 z-10 pointer-events-none">
          {searchLoading
            ? <Loader2 size={16} className="text-white/40 animate-spin" />
            : <Search size={16} className="text-white/40" />
          }
        </span>
        <input
          id="city-search-input"
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (suggestions.length > 0) setIsOpen(true); }}
          placeholder="Search city…"
          className="glass-input pl-9 pr-9 py-2 text-sm"
          autoComplete="off"
          aria-label="Search city"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          role="combobox"
        />
        {query && (
          <button
            onClick={clear}
            className="absolute right-3 z-10 text-white/40 hover:text-white/70 transition-colors"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Autocomplete dropdown */}
      {isOpen && suggestions.length > 0 && (
        <ul
          ref={dropdownRef}
          role="listbox"
          className="absolute top-full mt-2 w-full z-50 rounded-xl overflow-hidden border animate-slide-up"
          style={{
            background: isDark ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.95)',
            borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
          }}
        >
          {suggestions.map((city, idx) => (
            <li
              key={`${city.id || idx}-${city.name}`}
              role="option"
              aria-selected={highlightIndex === idx}
              onMouseDown={(e) => {
                e.preventDefault();
                selectCity(city);
              }}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-150 ${
                highlightIndex === idx
                  ? isDark ? 'bg-white/10' : 'bg-indigo-50'
                  : isDark ? 'hover:bg-white/6' : 'hover:bg-gray-50'
              }`}
            >
              <MapPin size={14} className="flex-shrink-0 text-indigo-400" />
              <div className="flex flex-col min-w-0">
                <span className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  {city.name}
                </span>
                <span className={`text-xs truncate ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                  {[city.region, city.country].filter(Boolean).join(', ')}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CitySearch;
