# SkyCast Glass 🌤️

A premium glassmorphism weather forecasting application built with **React**, **Tailwind CSS**, **Recharts**, and **WeatherAPI.com**.

---

## ✨ Features

- 🌡️ **Real-time weather data** via WeatherAPI.com
- 🔍 **City search with autocomplete** (debounced, keyboard-navigable)
- 📍 **Geolocation** — detect your city automatically
- 📊 **Interactive charts** — hourly temperature, precipitation, and 7-day comparison
- 📅 **7-day forecast** with expandable rows and temperature range bars
- ⏰ **Hourly forecast carousel** with current-hour highlight
- 🌅 **Sunrise/sunset arc** with live solar position
- 💨 **Air quality** with pollutant breakdown (PM2.5, PM10, Ozone, NO₂)
- ⚠️ **Weather alerts** when provided by the API
- ❤️ **Favorite cities** — save and switch instantly
- 🕓 **Recent searches** — with clear-all option
- 🌓 **Dark / Light mode** with smooth transition
- °C / °F **temperature toggle**
- Wind speed, pressure, visibility **unit preferences**
- All settings **persisted to localStorage**
- 🎭 **Demo mode** — works out-of-the-box without an API key
- ♿ **Accessible** — keyboard navigation, ARIA labels, semantic HTML
- 📱 **Fully responsive** — desktop, tablet, and mobile

---

## 🚀 Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure your API key

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
VITE_WEATHER_API_KEY=your_actual_key_here
```

Get a **free** API key at [weatherapi.com](https://www.weatherapi.com) (free tier supports 1M calls/month, 7-day forecast, air quality, and alerts).

### 3. Start the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
src/
  components/
    Navbar.jsx           # Glass navigation bar
    CitySearch.jsx       # Autocomplete search input
    WeatherHero.jsx      # Current conditions hero card
    WeatherStats.jsx     # 9-card statistics grid
    HourlyForecast.jsx   # 24-hour scrollable carousel
    WeeklyForecast.jsx   # 7-day forecast rows
    WeatherCharts.jsx    # Recharts interactive charts
    SunriseSunset.jsx    # Sunrise/sunset arc + moon phase
    AirQuality.jsx       # AQI and pollutant bars
    WeatherAlerts.jsx    # Official weather alerts
    FavoriteCities.jsx   # Favorites/recent sidebar
    SettingsModal.jsx    # Settings panel with all preferences
    LoadingSkeleton.jsx  # Skeleton loading placeholders
  hooks/
    useWeather.js        # Weather data fetching & state
    useCitySearch.js     # Search debounce & keyboard nav
    usePreferences.js    # Settings & localStorage persistence
  services/
    weatherService.js    # WeatherAPI.com integration & caching
  utils/
    temperature.js       # °C/°F, wind, pressure, visibility conversion
    weatherHelpers.js    # WMO codes, backgrounds, UV/AQI guidance
  App.jsx
  main.jsx
  index.css             # Glassmorphism design system
```

---

## 🔑 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_WEATHER_API_KEY` | Yes (for live data) | Your WeatherAPI.com API key |
| `VITE_WEATHER_API_BASE` | No | Override base URL (default: `https://api.weatherapi.com/v1`) |

> ⚠️ Never commit your real `.env.local` file. It is included in `.gitignore`.

---

## 🛡️ Production API Key Security

For production deployments, it is recommended to proxy all weather API calls through your own server-side endpoint to prevent exposing the API key in client-side JavaScript bundles.

Example: Create an Express/Vercel/Cloudflare Function that forwards requests to WeatherAPI and injects the key server-side.

---

## 🏗️ Build for Production

```bash
npm run build
```

Output goes to `dist/`. Deploy to Vercel, Netlify, or any static host.

---

## 📄 License

MIT
