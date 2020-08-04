import React from 'react';
import WeatherDetails from './WeatherDetails';

const WeatherList =(props) =>{
    if(!props.weather){
        return <div>Loading!</div>
    }
    const weatherItems = props.weather.map(data =>{
        return <WeatherDetails data={data} key={data.dt} units={props.units}/>
    })
    return(
        <div>
            <ol className="col-md-4 list-group">
            {weatherItems}
            </ol>
        </div>
    );
}
export default WeatherList;