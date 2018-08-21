import React, { Component } from 'react';
import Geocode from "react-geocode";


class MyGeocode extends Component {
  state = {
    address_to: 'Lviv',
    latidude_to: '49.839683',
    longitude_to: '24.029717',
    result_address: '',
    result_latidude: '',
    result_longitude: ''
  }

  handleChange = event => {
    this.setState({[event.target.name]: event.target.value});
  }

  handleSubmitOne = event => {
    event.preventDefault();

    const orders = {
      address_to: this.state.address_to
    };

    console.log(orders);

    // set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
    Geocode.setApiKey();

    // Enable or disable logs. Its optional.
    Geocode.enableDebug();

    // Get latidude & longitude from address.
    Geocode.fromAddress(orders.address_to).then(
      response => {
        const { lat, lng } = response.results[0].geometry.location;
        this.setState({result_latidude: lat});
        this.setState({result_longitude: lng});
        console.log(this.state.result_latidude);
        console.log(this.state.result_longitude);
      },
      error => {
        console.error(error);
      }
    );
  }

  handleSubmitTwo = event => {
    event.preventDefault();

    const orders = {
      latidude_to: this.state.latidude_to,
      longitude_to: this.state.longitude_to
    };

    console.log(orders);

    // set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
    Geocode.setApiKey();

    // Enable or disable logs. Its optional.
    Geocode.enableDebug();

    // Get address from latidude & longitude.
    Geocode.fromLatLng(orders.latidude_to, orders.longitude_to).then(
      response => {
        const address = response.results[0].formatted_address;
        this.setState({result_address: address});
        console.log(this.state.result_address);
      },
      error => {
        console.error(error);
      }
    );
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmitOne}>
          <label>
            Person address:
            <input type="text" name="address_to" value={this.state.address_to} onChange={this.handleChange} />
          </label>
          <button type="submit">Add</button>
        </form>
        <hr/>
        <div>
          { this.state.result_latidude} { this.state.result_longitude }
        </div>
        <hr/>
        <form onSubmit={this.handleSubmitTwo}>
          <label>
            Person latidude:
            <input type="text" name="latidude_to" value={this.state.latidude_to} onChange={this.handleChange} />
          </label>
          <label>
            Person longitude:
            <input type="text" name="longitude_to" value={this.state.longitude_to} onChange={this.handleChange} />
          </label>
          <button type="submit">Add</button>
        </form>
        <hr/>
        <div>
          { this.state.result_address }
        </div>
        <hr/>
      </div>
    )
  }
}

export default MyGeocode;