import React from "react";
import "./WeatherDetails.css";

const WeatherDetails = ({ data }) => {
  return (
    <div className="main-display">
      <h1 className="date">{data.date}</h1>
      <div className="weather-image">
        {data.data.low !== undefined && data.data.high === undefined ? (
          <>
            <img
              src={`http://openweathermap.org/img/w/${data.data.low.weather.icon}.png`}
              alt={data.data.low.weather.desciption}
            />
          </>
        ) : (
          <>
            <img
              src={`http://openweathermap.org/img/w/${data.data.high.weather.icon}.png`}
              alt={data.data.high.weather.desciption}
            />
          </>
        )}
      </div>
      <div className="temeratures">
        {data.data.low !== undefined && (
          <>Min: {Math.round(data.data.low.temp)} °C</>
        )}
      </div>
      <div className="temeratures">
        {data.data.high !== undefined && (
          <>Max: {Math.round(data.data.high.temp)} °C</>
        )}
      </div>
    </div>
  );
};

export default WeatherDetails;
