import { useState, useRef } from "react";
import Background from "./components/Background";
import './App.css'
function App() {
  const [city, setCity] = useState("");
  const [bg, setBg] = useState("morning-clear");
  const [error, setError] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [localTime, setLocalTime] = useState("");

  const clockRef = useRef(null);

  const API_KEY = "d1b2d0f08e524863f6037a40d3de1ae5";
  
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      getWeather();
    }
  };

  // ================= WEATHER FETCH =================
  const getWeather = async () => {
    if (!city) {
      setError("Please enter a city name");
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error("City not found");
      }

      const data = await response.json();

      setWeatherData(data);
      decideBackground(data);

      // 🕒 RESET OLD CLOCK
      if (clockRef.current) {
        clearInterval(clockRef.current);
      }

      // 🕒 START NEW CITY CLOCK
      clockRef.current = startCityClock(data.timezone);

    } catch (err) {
      setError(err.message);
    }
  };

  // ================= TIME OF DAY =================
  const getTimeOfDay = (data) => {
    const utcNow = Date.now();
    const cityTime = utcNow + data.timezone * 1000;
    const hours = new Date(cityTime).getUTCHours();

    if (hours >= 5 && hours < 12) return "morning";
    if (hours >= 12 && hours < 18) return "afternoon";
    return "night";
  };

  // ================= WEATHER TYPE =================
  const getWeatherType = (data) => {
    const condition = data.weather[0].main;

    if (condition === "Snow") return "snowy";

    if (condition === "Rain" || condition === "Drizzle" || condition === "Thunderstorm") return "rainy";
    if (condition === "Clouds" || condition === "Mist" || condition === "Haze" || condition === "Fog") return "cloudy";

    return "clear";
  };

  // ================= BACKGROUND =================
  const decideBackground = (data) => {
    const time = getTimeOfDay(data);
    const weather = getWeatherType(data);

    if (weather === "snowy") {
      setBg("snowy");
    } else if (weather === "rainy") {
      setBg("rainy");
    } else if (weather === "cloudy") {
      setBg("cloudy");
    } else {
      setBg(time === "night" ? "night-clear" : "morning-clear");
    }
  };

  // ================= LIVE CLOCK =================
  const startCityClock = (timezone) => {
    const updateTime = () => {
      const nowUTC = Date.now();
      const cityTime = nowUTC + timezone * 1000;

      const formatted = new Date(cityTime).toLocaleString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "UTC",
      });

      setLocalTime(formatted);
    };

    updateTime();
    return setInterval(updateTime, 1000);
  };

  return (
    <div className="app-container d-flex flex-column">
      <Background type={bg} />

      {/* --- ERROR MESSAGE (Moved here for visibility) --- */}
      {error && (
        <div className="error-toast">
          ⚠️ {error}
        </div>
      )}

      {/* Search Bar */}
      <div className="container search-wrapper">
        <div className="row justify-content-center">
          <div className="col-11 col-sm-11 col-md-8 col-lg-6">
            <div className="search-box d-flex align-items-center">
              <input
                type="text"
                className="form-control bg-transparent border-0 text-white px-4"
                placeholder="Enter city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                className="btn btn-light rounded-pill px-4 ms-2"
                onClick={getWeather}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Weather Card Wrapper */}
      {weatherData && (
        <div className="container weather-wrapper flex-grow-1 d-flex flex-column mt-5">
          <div className="row justify-content-center">
            <div className="col-11 col-sm-11 col-md-8 col-lg-5">
              <div className="glass-card text-center fade-in">
                <h2 className="mb-2">
                  {weatherData.name}, {weatherData.sys.country}
                </h2>

                <p className="time display-3 fw-bold">{localTime}</p>

                <div className="temp">
                  {Math.round(weatherData.main.temp)}°C
                </div>

                <p className="description text-capitalize fs-5 mb-3">
                  {weatherData.weather[0].description}
                </p>

                <p className="mb-4">Feels like {Math.round(weatherData.main.feels_like)}°C</p>

                <div className="extra-info d-flex justify-content-around border-top pt-3">
                  <span>💧{weatherData.main.humidity}%</span>
                  <span>🌬 {weatherData.wind.speed} m/s</span>
                  <span>🧭 {weatherData.main.pressure} hPa</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

}

export default App
