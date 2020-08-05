import React, { useState, useEffect, useCallback } from "react";
import "./WeatherCard.css";
import WeatherList from "./WeatherList";
import SearchForm from "./SearchForm";
import axios from "axios";

import data from "../JsonData";
const API_KEY = "986df41cb8f0c0e4760d17130fc344d7";

const WeatherCard = () => {
  const [state, setState] = useState({
    city: "Cape Town",
    temp: 20,
    tempUnits: "celsius",
  });

  const [currentWeather, setCurrentWeather] = useState({
    icon: "",
    main: "",
    mainTemp: "",
    temp: {
      min: "",
      max: "",
    },
  });

  const [weather, setWeather] = useState([]);

  useEffect(() => {
    const URL = `http://api.openweathermap.org/data/2.5/weather?q=${state.city}&units=metric&appid=${API_KEY}`;

    axios
      .get(URL)
      .then((response) => {
        const { data } = response;
        setCurrentWeather({
          icon: data.weather[0].icon,
          main: data.weather[0].main,
          mainTemp: data.main.temp,
          temp: {
            min: data.main.temp_min,
            max: data.main.temp_max,
          },
        });
      })
      .catch((error) => {});
  }, []);

  const loopCall = useCallback(() => {
    const URL = `http://api.openweathermap.org/data/2.5/forecast?q=${state.city}&units=metric&appid=${API_KEY}`;
    axios
      .get(URL)
      .then((response) => {
        const { data } = response;

        if (data.cod === "200") {
          const arr = data.list.filter((e) => {
            const val = e.dt_txt.split(" ")[1];
            return val === "00:00:00" || val === "12:00:00";
          });

          // Sort data according matching days

          const matching = [];

          arr.forEach((value) => {
            // take date
            const date = value.dt_txt.split(" ")[0];

            if (matching[date]) {
              matching[date].push(value);
            } else {
              matching[date] = [value];
            }
          });

          // convert to proper array
          const toArray = Object.entries(matching);

          const finalData = [];

          toArray.forEach((value) => {
            const itemData = {};

            value[1].forEach((itemValue) => {
              const time = itemValue.dt_txt.split(" ")[1];

              const dataCons = {
                temp: itemValue.main.temp,
                weather: itemValue.weather[0],
              };

              if (time === "12:00:00") {
                itemData["high"] = dataCons;
              } else {
                itemData["low"] = dataCons;
              }
            });

            finalData.push({
              date: value[0],
              data: itemData,
            });
          });

          setWeather(finalData);
        } else {
        }
      })
      .catch((error) => {});
  }, [state.city]);

  useEffect(() => {
    loopCall();
  }, [loopCall]);

  const onSearchSubmit = (city) => {
    setState({ city });
  };
  // toCelsius =fahrenheit=>{
  //     return (Math.round)
  // }
  const toFahrenheit = (celsius) => {
    return Math.round((celsius * 9) / 5 + 32);
  };

  const onValueChange = (e) => {
    setState({ tempUnits: e.target.value });
    // if(e.target.value ==="fahrenheit"){
    //     newTemp =
    // }
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    console.log(state.tempUnits);
  };

  return (
    <div className="card">
      <SearchForm onSubmit={onSearchSubmit} />
      <h1>Weekly weather forecast in {state.city}</h1>
      <form onSubmit={onFormSubmit}>
        <label htmlFor="celsius">
          <input
            onChange={onValueChange}
            type="radio"
            id="celsius"
            checked={state.tempUnits === "celsius"}
            value="celsius"
          />
          Celsius
        </label>
        <label htmlFor="fahrenheit">
          <input
            onChange={onValueChange}
            type="radio"
            id="fahrenheit"
            checked={state.tempUnits === "fahrenheit"}
            value="fahrenheit"
          />
          Fahrenheit
        </label>
      </form>

      <div className="currentWeather">
        <div className="main-info">
          <div className="temp-measurement">{state.temp}</div>
          <div className="temp-unit">°C</div>
        </div>

        <div className="sub-info">
          <div className="sub-info-title">Current Weather Today</div>

          <div className="sub-info-text">Sunny</div>

          <div className="sub-info-text">
            <span className="max-temp">
              <i className="mdi mdi-arrow-up" />
              {30}
              °C
            </span>
            <span className="min-temp">
              <i className="mdi mdi-arrow-down" />
              {13}
              °C
            </span>
          </div>
        </div>
      </div>

      {/* <div className="currentWeather"> Current temperatures in {state.city}</div> */}

      <WeatherList weather={weather} units={state.tempUnits} />
    </div>
  );
};

export default WeatherCard;
