import React,{Component} from 'react';
import './WeatherCard.css'
import WeatherList from './WeatherList';
import SearchForm from './SearchForm';
// import axios from 'axios';

import data from '../JsonData';
// const API_KEY = "986df41cb8f0c0e4760d17130fc344d7";

class WeatherCard extends Component{
    state={
        city: "Cape Town",
        temp: 20,
        weather: [],
        tempUnits: "celsius"
    };
    onSearchSubmit=(city)=>{
        this.setState({city});
        
    }
    // toCelsius =fahrenheit=>{
    //     return (Math.round)
    // }
    toFahrenheit=celsius=>{
        return Math.round((celsius * 9/5) + 32);
    }
    onValueChange =(e)=>{
        this.setState({tempUnits: e.target.value})
        // if(e.target.value ==="fahrenheit"){
        //     newTemp = 
        // }
    }
    onFormSubmit=(e)=>{
        e.preventDefault();
        console.log(this.state.tempUnits)
    }
    render(){
        
        return(
            <div className="card">
            <SearchForm onSubmit={this.onSearchSubmit}/>
            <h1>Weekly weather forecast in {this.state.city}</h1>
            <form onSubmit={this.onFormSubmit}>
                <label htmlFor="celsius">
                    <input 
                        onChange={this.onValueChange}
                        type="radio"
                        id="celsius"
                        checked={this.state.tempUnits ==="celsius"}
                        value="celsius" />Celsius
                </label>
                <label htmlFor="fahrenheit">
                    <input 
                        onChange={this.onValueChange}
                        type="radio"
                        id="fahrenheit"
                        checked={this.state.tempUnits ==="fahrenheit"}
                        value="fahrenheit" />Fahrenheit
                </label>
            </form>
        
            <div className="currentWeather">

          <div className="main-info">
            <div className="temp-measurement">{this.state.temp}</div>
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

            {/* <div className="currentWeather"> Current temperatures in {this.state.city}</div> */}
            
            <WeatherList weather={this.state.weather} units={this.state.tempUnits} />  
            
            </div>
        );
        
    }

   async componentDidMount() {
    //    setInterval(async ()=>{
    //     const URL = (`http://api.openweathermap.org/data/2.5/forecast?q=${this.state.city}&units=metric&appid=${API_KEY}`)
    //    let response = await axios.get(URL);
    //    let data  = response.data;
    // //    console.log(data);
    //    this.setState({weather: data.list.splice(0, 6) });
       
    //    console.log(this.state.weather);
    //    }, 30000);
    let arr = data[0].list.filter(e=>{
        //console.log(e.dt_txt.split(" ")[1]==="00:00:00");
        return  e.dt_txt.split(" ")[1]==="00:00:00";
    })
    console.log(arr)
    this.setState({weather: arr});
    console.log(this.state);
    console.log(data[0].list[0].dt_txt.split(" ")[1]);
    // console.log(data[0].list.filter(e=>{
    //     return e.dt_txt.split(" ")[1];
    // }));
     
   }
   

}
export default WeatherCard;
