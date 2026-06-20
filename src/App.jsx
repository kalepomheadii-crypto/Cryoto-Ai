import React from "react";
import WeatherDashboard from "./components/WeatherDashboard";

export default function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>Weather Dashboard</h1>
      </header>
      <main>
        <WeatherDashboard />
      </main>
      <footer className="footer">
        <small>Powered by Open-Meteo • No API key required</small>
      </footer>
    </div>
  );
}
