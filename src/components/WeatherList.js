import React from "react";
import WeatherDetails from "./WeatherDetails";

const WeatherList = (props) => {
  const { weather, units } = props;

  return (
    <>
      {weather.length === 0 ? (
        <div>Loading!</div>
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
