import React, { Component } from "react";
import "./app.css";
import DelAppBar from './components/header/header';
import Orders from './components/orders/orders';
// import LocationSearchInput from "./components/googlemapsapi/searchbar";
// import MyGeocode from './components/googlemapsapi/geocode'
import Map from './components/googlemapsapi/map'
import DrivingTime from './components/googlemapsapi/drivingtime'

export default class App extends Component {

  render() {
    return (
      <div>
        <DelAppBar/>
        <br/>
        <Map/>
        <hr/>
        <Orders/>
        <DrivingTime/>
      </div>
    );
  }
}
