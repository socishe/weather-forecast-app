import React from "react";
import WeatherDetails from "./WeatherDetails";

const WeatherList = (props) => {
  const { weather, units, error } = props;

  return (
    <>
      {weather.length === 0 ? (
        <div>{!error ? "Loading!" : "Failed to load"}</div>
      ) : (
        <div className="list-group">
          {weather.map((data) => {
            return <WeatherDetails data={data} key={data.date} units={units} />;
          })}
        </div>
      )}
    </>
  );
};

export default WeatherList;
