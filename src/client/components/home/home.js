import React, { Component } from 'react';
import './home.css';
import delivery from '../../../../public/delivery.png';
// import axios from 'axios';
import api from '../../api';

class HomeComponent extends Component {

  render() {
    return (
      <div>
        <img src={delivery} />
        <h1>Delivery App</h1>
      </div>
    )
  }
}

export default HomeComponent;
