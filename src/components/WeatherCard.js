import React, { useState, useEffect, useCallback } from "react";
import "./WeatherCard.css";
import WeatherList from "./WeatherList";
import SearchForm from "./SearchForm";
import axios from "axios";

// import data from "../JsonData";
const API_KEY = "87c4d0766e312391d63eb4c67ad58131";

const WeatherCard = () => {
  const [state, setState] = useState({
    city: "Cape Town",
    tempUnits: "celsius",
    tempSymbol: "°C",
  });

  const [currentWeather, setCurrentWeather] = useState({
    icon: "",
    main: "",
    tempUnits: "celsius",
    mainTemp: 0,
    timezone: "",
    temp: {
      min: 0,
      max: 0,
    },
  });

  const [weather, setWeather] = useState([]);

  const [showRetry, setShowRetry] = useState(false);
  const [error, setError] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    const keepCalling = () => {
      const URL = `https://api.openweathermap.org/data/2.5/weather?q=${state.city}&units=metric&appid=${API_KEY}`;

      axios
        .get(URL)
        .then((response) => {
          const { data } = response;
          setCurrentWeather({
            icon: data.weather[0].icon,
            main: data.weather[0].main,
            time: data.timezone,
            mainTemp: Math.round(data.main.temp),
            temp: {
              min: Math.round(data.main.temp_min),
              max: Math.round(data.main.temp_max),
            },
          });

          setTimeout(() => {
            keepCalling();
          }, 1200000); // 20min
        })
        .catch(() => {});
    };

    keepCalling();
  }, [state.city]);

  /**
   * Make API call
   */
  const makeCall = useCallback(() => {
    return new Promise((resolve, reject) => {
      const URL = `https://api.openweathermap.org/data/2.5/forecast?q=${state.city}&units=metric&appid=${API_KEY}`;

      axios
        .get(URL)
        .then((response) => {
          const { data } = response;

          // Check if we got a good response, which is 200

          if (data.cod === "200") {
            // Don't retry, everything is good

            resolve(false);

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

            let toArray = Object.entries(matching);
            toArray = toArray.filter((e) => {
              return e[1].length !== 1;
            });

            const finalData = [];

            toArray.forEach((value) => {
              const itemData = {};

              value[1].forEach((itemValue) => {
                const time = itemValue.dt_txt.split(" ")[1];

                const roundTemp = Math.round(itemValue.main.temp);

                const dataCons = {
                  temp: roundTemp,
                  mainTemp: roundTemp,
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
            // Retry

            resolve(true);
          }
        })
        .catch((error) => {
          // Retry

          resolve(true);
        });
    });
  }, [state.city]);

  /**
   * Exponetially delay re-try periods, until successful
   *
   * @param {Function} apiCaller - makes api call
   * @param {number} delay - a deplay timer for re-retrying
   */

  const loopCall = useCallback(
    async (apiCaller, delay) => {
      const retry = await apiCaller().then((response) => {
        return response;
      });

      if (retry) {
        if (delay <= 16000) {
          console.log("Next delay", delay);

          setShowRetry(true);

          setRemainingTime(delay);

          const timer = setTimeout(() => {
            if (retrying) {
              setRetrying(false);
              clearTimeout(timer);
            } else {
              loopCall(apiCaller, delay * 2);
            }
          }, delay);
        } else {
          console.log("Just stop trying.");
          setError(true);
          setShowRetry(false);
          setRemainingTime(0);
        }
      } else {
        setShowRetry(false);
        setRemainingTime(0);
      }
    },
    [retrying]
  );

  const onRetry = () => {
    setRetrying(true);
    setShowRetry(false);

    makeCall().then((response) => {
      return response;
    });
  };

  useEffect(() => {
    loopCall(makeCall, 2000);
  }, [loopCall, state.city, makeCall]);
 

  const onSearchSubmit = (city) => {
    setState({ city, tempUnits: "celsius", tempSymbol: "°C" });
    // setCurrentWeather({ city, tempSymbol: "°C" });
    // setCurrentWeather
  };

  const toCelsius = (fahrenheit) => {
    return Math.round((fahrenheit - 32) * (5 / 9));
  };

  const toFahrenheit = (celsius) => {
    return Math.round(celsius * (9 / 5) + 32);
  };

  const converter = (temp, type) => {
    if (type !== "celsius") {
      return toFahrenheit(temp);
    }

    return toCelsius(temp);
  };

  const onValueChange = (e) => {
    const value = e.target.value;

    let symbol = "°C";

    if (value !== "celsius") {
      symbol = "°F";
    }
    // const handlAlert =()=>{

    // };
    // const calcTime =()=>{
    // let date = new Date();
    // const localTime = date.getTime();
    // const localOffset = date.getTimeZoneOffset() * 60000;
    // const uct = localTime + localOffset;
    // var remoteTime = uct + (1000 + currentWeather.timezone);
    // console.log(remoteTime);
    //  const timezone = currentWeather.time;
    //  const timezoneInMinutes = timezone/60;
    //  const currentTime;
    // };

    /**
     * Convert current weather
     * @var Object
     */
    const calCurrent = {
      icon: currentWeather.icon,
      main: currentWeather.main,
      mainTemp: converter(currentWeather.mainTemp, value),
      temp: {
        min: converter(currentWeather.temp.min, value),
        max: converter(currentWeather.temp.max, value),
      },
    };

    setCurrentWeather(calCurrent);

    /**
     * Convert weather array data
     * @var array
     */

    const changeWeather = weather.map((objValue) => {
      const val = objValue;

      if (val.data.high !== undefined) {
        val.data.high.temp = converter(val.data.high.temp, value);
      }

      if (val.data.low !== undefined) {
        val.data.low.temp = converter(val.data.low.temp, value);
      }

      return val;
    });

    setWeather(changeWeather);

    setState({ ...state, tempSymbol: symbol, tempUnits: value });
  };

  return (
    <div className="card">
      <SearchForm onSubmit={onSearchSubmit} />
      <h1 className="main-card-header">
        Weekly weather forecast in {state.city}
      </h1>
      <div className="options-container">
        <label htmlFor="celsius">
          <input
            onChange={onValueChange}
            type="radio"
            id="celsius"
            checked={state.tempUnits === "celsius"}
            value="celsius"
          />
          <div>Celsius</div>
        </label>
        <label htmlFor="fahrenheit">
          <input
            onChange={onValueChange}
            type="radio"
            id="fahrenheit"
            checked={state.tempUnits === "fahrenheit"}
            value="fahrenheit"
          />
          <div>Fahrenheit</div>
        </label>
      </div>
      <div className="currentWeather">
        <div className="main-info">
          <div className="temp-measurement">{currentWeather.mainTemp}</div>
          <div className="temp-unit">
            {state.tempUnits === "celsius" ? "°C" : "°F"}
          </div>
        </div>
        <div className="sub-info">
          <div className="sub-info-datatitle">Current Weather Today</div>

          <div className="sub-info-text">{currentWeather.main}</div>

          <div className="sub-info-text">
            <span className="max-temp">
              <i className="mdi mdi-arrow-up" />
              {`${currentWeather.temp.min} ${state.tempSymbol}`}
            </span>
            <span className="min-temp">
              <i className="mdi mdi-arrow-down" />
              {`${currentWeather.temp.max} ${state.tempSymbol}`}
            </span>
          </div>
        </div>
      </div>

      <WeatherList
        error={error && !showRetry}
        weather={weather}
        units={state.tempSymbol}
      />
      {showRetry && (
        <div className="retry-container">
          <button className="retry-btn" onClick={onRetry}>
            Retry now
          </button>
          <div>{`Retrying in ${remainingTime / 1000} sec.`}</div>
        </div>
      )}
    </div>
  );
};

export default WeatherCard;
