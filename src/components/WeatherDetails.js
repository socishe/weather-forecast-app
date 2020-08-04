import React from 'react';
import './WeatherDetails.css';

const WeatherDetails =({data})=>{
    
    return(
        // <li> {data.main.temp_max}</li>
        <div className="main-display">
        
				<h1 className="date">{data.dt_txt.split(" ")[0]}</h1>
        {/* <h1 style={{textAlign: "center"}}>{data.weather.description}</h1> */}
				<div className="weather-image">
					{/* <img src="http://openweathermap.org/img/w/${data.weather.icon}.png" alt={data.weather.description} /> */}
				</div>
				<div className="temeratures">Min: {Math.round(data.main.temp_min)} °C</div>
				<div className="temeratures">Max: {Math.round(data.main.temp_max)}°C</div>
			</div>
          );
};

export default WeatherDetails;