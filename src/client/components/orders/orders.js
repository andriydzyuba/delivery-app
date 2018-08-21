import React, { Component } from 'react';
import './orders.css';
// import axios from 'axios';
import api from '../../api';

class Orders extends Component {
  state = {
    orders: []
  }

  componentDidMount() {
    api().get(`/api/orders`)
      .then(res => {
        const orders = res.data;
        this.setState({ orders });
        console.log(res.data)
      })
  }

  render() {
    return (
      <ul>
        { this.state.orders.map(orders => <li key={orders.id}>{ orders.id } | { orders.address_to } | ({ orders.point_to.coordinates[0] }, { orders.point_to.coordinates[1] }) | { orders.contacts } | { orders.date }</li>)}
      </ul>
    )
  }
}

export default Orders;
