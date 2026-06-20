import React, { useState, useEffect } from "react";
import WeatherCard from "./WeatherCard";

/*
Uses:
- Geocoding API: https://geocoding-api.open-meteo.com/v1/search?name={name}
- Weather API: https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true&hourly=temperature_2m&timezone=auto
No API key required.
*/

export default function WeatherDashboard() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [location, setLocation] = useState(null); // {name, latitude, longitude, country}
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch weather when location changes
  useEffect(() => {
    if (!location) return;
    setLoading(true);
    setError(null);
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(
      location.latitude
    )}&longitude=${encodeURIComponent(
      location.longitude
    )}&current_weather=true&hourly=temperature_2m,relativehumidity_2m&timezone=auto`;
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error("Weather fetch failed");
        return r.json();
      })
      .then((data) => {
        setWeather({ meta: data, fetchedAt: Date.now() });
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [location]);

  // Autocomplete suggestions
  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    const controller = new AbortController();
    const q = encodeURIComponent(query);
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${q}&count=5&language=en&format=json`;
    fetch(url, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject("geocoding failed")))
      .then((data) => {
        setSuggestions(data.results || []);
      })
      .catch(() => {
        // ignore abort/errors
      });
    return () => controller.abort();
  }, [query]);

  function chooseSuggestion(s) {
    setLocation({
      name: s.name,
      latitude: s.latitude,
      longitude: s.longitude,
      country: s.country,
    });
    setQuery("");
    setSuggestions([]);
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        // Reverse geocode via Open-Meteo search with lat/lon (they support search by lat/lon using the same endpoint)
        const url = `https://geocoding-api.open-meteo.com/v1/search?latitude=${lat}&longitude=${lon}&count=1`;
        fetch(url)
          .then((r) => r.json())
          .then((data) => {
            const r0 = data.results && data.results[0];
            setLocation(
              r0
                ? {
                    name: r0.name,
                    latitude: r0.latitude,
                    longitude: r0.longitude,
                    country: r0.country,
                  }
                : { name: "My Location", latitude: lat, longitude: lon }
            );
          })
          .catch(() =>
            setLocation({ name: "My Location", latitude: lat, longitude: lon })
          )
          .finally(() => setLoading(false));
      },
      (err) => {
        setError(err.message || "Geolocation error");
        setLoading(false);
      }
    );
  }

  return (
    <div className="dashboard">
      <div className="controls">
        <div className="search">
          <input
            placeholder="Search city or place (e.g., London)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search location"
          />
          <button onClick={() => query && setQuery(query)}>Search</button>
          <button onClick={useMyLocation}>Use my location</button>
        </div>
        {suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((s) => (
              <li key={`${s.id || s.latitude}-${s.longitude}`}>
                <button onClick={() => chooseSuggestion(s)}>
                  {s.name}
                  {s.admin1 ? `, ${s.admin1}` : ``} {s.country ? `(${s.country})` : ``}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <div className="error">Error: {error}</div>}
      {loading && <div className="loading">Loading…</div>}

      {location && weather && (
        <WeatherCard location={location} weather={weather.meta} />
      )}

      {!location && !loading && (
        <div className="placeholder">
          Try searching for a city, or click "Use my location".
        </div>
      )}
    </div>
  );
}
