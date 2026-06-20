import React from "react";

/* Map Open-Meteo weathercode to short description (simplified) */
const weatherCodeMap = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Drizzle: Light",
  53: "Drizzle: Moderate",
  55: "Drizzle: Dense",
  61: "Rain: Slight",
  63: "Rain: Moderate",
  65: "Rain: Heavy",
  71: "Snow: Slight",
  73: "Snow: Moderate",
  75: "Snow: Heavy",
  80: "Rain showers: Slight",
  81: "Rain showers: Moderate",
  82: "Rain showers: Violent",
  95: "Thunderstorm",
  99: "Thunderstorm with hail",
};

export default function WeatherCard({ location, weather }) {
  const cw = weather.current_weather;
  const hourly = weather.hourly;
  // find index of current hour in hourly.time
  const times = hourly?.time || [];
  const temps = hourly?.temperature_2m || [];
  const now = cw?.time;
  let currentHourIndex = times.findIndex((t) => t === now);
  if (currentHourIndex === -1) currentHourIndex = 0;

  // next 24 hours slice
  const nextTemps = temps.slice(currentHourIndex, currentHourIndex + 24);
  const nextTimes = times.slice(currentHourIndex, currentHourIndex + 24);

  return (
    <section className="weather-card">
      <h2>
        {location.name} {location.country ? `, ${location.country}` : ""}
      </h2>

      {cw ? (
        <div className="current">
          <div className="temp">{Math.round(cw.temperature)}°C</div>
          <div className="meta">
            <div>{weatherCodeMap[cw.weathercode] || "Weather"}</div>
            <div>Wind: {cw.windspeed} km/h</div>
            <div>Wind dir: {cw.winddirection}°</div>
            <div>Time: {cw.time}</div>
          </div>
        </div>
      ) : (
        <div>No current weather available</div>
      )}

      {nextTemps && nextTemps.length > 0 && (
        <div className="hourly">
          <h3>Next {nextTemps.length} hours</h3>
          <div className="hourly-grid">
            {nextTemps.map((t, i) => (
              <div className="hour" key={nextTimes[i]}>
                <div className="hour-time">
                  {new Date(nextTimes[i]).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                <div className="hour-temp">{Math.round(t)}°C</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
