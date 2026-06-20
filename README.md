# Weather Dashboard (React + Vite)

A small weather dashboard that uses Open-Meteo (no API key).

Features:
- Search city/place using Open-Meteo geocoding
- Show current weather and hourly forecast
- Use browser geolocation
- No API key required

Run locally:
1. npm install
2. npm run dev
3. Open http://localhost:5173

APIs used:
- Geocoding: https://geocoding-api.open-meteo.com/v1/search
- Weather: https://api.open-meteo.com/v1/forecast

Notes and next steps:
- Add caching (localStorage) to reduce API calls.
- Add a nicer chart (e.g., Chart.js or Recharts) for hourly temps.
- Add unit toggle (Celsius/Fahrenheit).
- Add error handling and loading states for each network request.
