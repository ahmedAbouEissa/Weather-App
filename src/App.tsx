import React, { useState, useCallback } from "react";
import "./App.css";
import clearWeatherImage from "./assets/clear.png";
import cloudWeatherImage from "./assets/cloud.png";
import drizzleWeatherImage from "./assets/drizzle.png";
import humidityWeatherImage from "./assets/humidity.png";
import rainWeatherImage from "./assets/rain.png";
import searchWeatherImage from "./assets/search.png";
import snowWeatherImage from "./assets/snow.png";
import windWeatherImage from "./assets/wind.png";
import debounce from "lodash/debounce";

function App() {
  const [weatherData, setWeatherData] = useState<{
    main: { temp: number | null; humidity: number | null };
    name: string;
    weather: [{ icon: string }];
    wind: { speed: number | null };
  }>({
    main: { temp: null, humidity: null },
    name: "",
    weather: [{ icon: "" }],
    wind: { speed: null },
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getCurrentWeather = async (city: string) => {
    setLoading(true);
    const weatherEndPoint = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=30053ff81b2cda8061498205b8755340`;
    const weatherRes = await fetch(weatherEndPoint);
    const weatherData = await weatherRes.json();
    if (weatherData.cod == "404" || weatherData.cod == "400") {
      setError(true);
    } else {
      setWeatherData(weatherData);
      setError(false);
    }
    setLoading(false);
  };

  const getCurrentWeatherDebounce = useCallback(
    debounce(getCurrentWeather, 1000),
    []
  );

  const weatherIconCheck = () => {
    if (
      weatherData.weather[0].icon == "01d" ||
      weatherData.weather[0].icon == "01n"
    ) {
      return (
        <img className="weather-icon" src={clearWeatherImage} alt="icon" />
      );
    } else if (
      weatherData.weather[0].icon == "02d" ||
      weatherData.weather[0].icon == "02n"
    ) {
      return (
        <img className="weather-icon" src={cloudWeatherImage} alt="icon" />
      );
    } else if (
      weatherData.weather[0].icon == "03d" ||
      weatherData.weather[0].icon == "03n"
    ) {
      return (
        <img
          className="weather-icon"
          src="https://openweathermap.org/img/wn/03d@2x.png"
          alt="icon"
        />
      );
    } else if (
      weatherData.weather[0].icon == "04d" ||
      weatherData.weather[0].icon == "04n"
    ) {
      return (
        <img
          className="weather-icon"
          src="https://openweathermap.org/img/wn/04d@2x.png"
          alt="icon"
        />
      );
    } else if (
      weatherData.weather[0].icon == "09d" ||
      weatherData.weather[0].icon == "09n"
    ) {
      return (
        <img className="weather-icon" src={drizzleWeatherImage} alt="icon" />
      );
    } else if (
      weatherData.weather[0].icon == "10d" ||
      weatherData.weather[0].icon == "10n"
    ) {
      return <img className="weather-icon" src={rainWeatherImage} alt="icon" />;
    } else if (
      weatherData.weather[0].icon == "11d" ||
      weatherData.weather[0].icon == "11n"
    ) {
      return (
        <img
          className="weather-icon"
          src="https://openweathermap.org/img/wn/11d@2x.png"
          alt="icon"
        />
      );
    } else if (
      weatherData.weather[0].icon == "13d" ||
      weatherData.weather[0].icon == "13n"
    ) {
      return <img className="weather-icon" src={snowWeatherImage} alt="icon" />;
    } else {
      return (
        <img
          className="weather-icon"
          src="https://openweathermap.org/img/wn/50d@2x.png"
          alt="icon"
        />
      );
    }
  };

  return (
    <div className="weather-app-container">
      <div className="weather-app-wrapper">
        <div className="city-search-weather-container">
          <input
            className="city-search-weather"
            placeholder="City"
            onChange={(e) => getCurrentWeatherDebounce(e.target.value)}
          />
          <img
            className="search-icon-image"
            src={searchWeatherImage}
            alt="icon"
          />
        </div>
        {loading && <h2 className="handle-messages">...Loading</h2>}
        {!loading &&
          !error &&
          weatherData.main.temp &&
          weatherData.main.humidity &&
          weatherData.wind.speed && (
            <>
              <div className="weather-tempreture-container">
                {weatherIconCheck()}
                <h1>
                  {Math.round(weatherData.main.temp - 273.15)}
                  <span className="weather-tempreture-span"> °C</span>
                </h1>
                <h1>{weatherData.name}</h1>
              </div>
              <div className="weather-app-Humidity-container">
                <div className="weather-app-Humidity-wrapper">
                  <img
                    className="humidity-wind-weather-image"
                    src={humidityWeatherImage}
                    alt="icon"
                  />
                  <div className="humidity-wind-weather-details">
                    <h5>{weatherData.main.humidity} %</h5>
                    <h6>Humidity</h6>
                  </div>
                </div>
                <div className="weather-app-Humidity-wrapper">
                  <img
                    className="humidity-wind-weather-image"
                    src={windWeatherImage}
                    alt="icon"
                  />
                  <div className="humidity-wind-weather-details">
                    <h5>{Math.round(weatherData.wind.speed * 3.6)} Km/h</h5>
                    <h6>Wind Speed</h6>
                  </div>
                </div>
              </div>
            </>
          )}
        {!loading &&
          !error &&
          !weatherData.main.temp &&
          !weatherData.main.humidity &&
          !weatherData.wind.speed && (
            <h2 className="handle-messages">Please enter the city</h2>
          )}
        {!loading && error && (
          <h2 className="handle-messages">City not found</h2>
        )}
      </div>
    </div>
  );
}

export default App;
