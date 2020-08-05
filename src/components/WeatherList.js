import React from "react";
import WeatherDetails from "./WeatherDetails";

const WeatherList = (props) => {
  const { weather, units } = props;

  return (
    <div>
      {weather.length === 0 ? (
        <div>Loading!</div>
      ) : (
        <ol className="col-md-4 list-group">
          {weather.map((data) => {
            return <WeatherDetails data={data} key={data.date} units={units} />;
          })}
        </ol>
      )}
    </div>
  );
};

export default WeatherList;
