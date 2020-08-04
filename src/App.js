import React, {Component} from 'react';
import './App.css';
// import axios from 'axios';
import WeatherCard from './components/WeatherCard';
class App extends Component{
  render(){
    return(
      <div className ="App">
      <WeatherCard />
        
      </div>
    )
  }
  // componentDidMount(){
  //   //load data 
  //   // API key 986df41cb8f0c0e4760d17130fc344d7
  //   axios.get("api.openweathermap.org/data/2.5/weather?q={city name}&appid={986df41cb8f0c0e4760d17130fc344d7}").then(response =>{
  //     console.log(response);
  //   })
  //   // set state with that data
  // }
}

export default App;
