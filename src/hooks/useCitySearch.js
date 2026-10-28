import { useState, useEffect, useRef, useCallback } from 'react';
import { searchCities } from '../services/weatherService';

const DEBOUNCE_MS = 350;

/**
 * useCitySearch — handles search input, debounced suggestions, keyboard nav.
 */
export const useCitySearch = (onCitySelect) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  const search = useCallback(async (q) => {
    if (q.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }
    setSearchLoading(true);
    const results = await searchCities(q);
    setSuggestions(results);
    setIsOpen(results.length > 0);
    setHighlightIndex(-1);
    setSearchLoading(false);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }
    debounceRef.current = setTimeout(() => search(query), DEBOUNCE_MS);
    return () => clearTimeout(debounceRef.current);
  }, [query, search]);

  const handleKeyDown = useCallback((e) => {
    if (!isOpen) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = highlightIndex >= 0 ? suggestions[highlightIndex] : suggestions[0];
      if (target) selectCity(target);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setHighlightIndex(-1);
      inputRef.current?.blur();
    }
  }, [isOpen, suggestions, highlightIndex]);

  const selectCity = useCallback((city) => {
    const label = `${city.name}, ${city.country}`;
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    setHighlightIndex(-1);
    onCitySelect(city);
  }, [onCitySelect]);

  const clear = useCallback(() => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
  }, []);

  return {
    query,
    setQuery,
    suggestions,
    searchLoading,
    isOpen,
    setIsOpen,
    highlightIndex,
    handleKeyDown,
    selectCity,
    clear,
    inputRef,
  };
};
