import React, { Component } from 'react';
import './create.css';
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button';
// import axios from 'axios';
import api from '../../api';

export class Create extends Component {
    state = {
      contacts: '',
      // lat: null,
      // lng: null,
      // address_to: '',
    }

  // componentWillMount() {
  //   this.setState({
  //     lat: this.props.lat,
  //     lng: this.props.lng,
  //     address_to: this.props.address
  //   })
  // }

    handleChange = event => {
      this.setState({
        contacts: event.target.value,
        // lat: this.props.lat,
        // lng: this.props.lng,
        // address_to: this.props.address
      });
      console.log(this.state);
    }

    handleSubmit = event => {
      event.preventDefault();

      const orders = {
        contacts: this.state.contacts,
        point_to: { type: 'Point', coordinates: [this.props.lat,this.props.lng]},
        address_to: this.props.address
      };

      api().post(`/api/orders`, orders)
        .then(res => {
          console.log(res);
          console.log(res.data);
        })
    }

    render() {
      return (
        <div>
          <form onSubmit={this.handleSubmit}>
            <TextField style={{padding: 24}}
                         placeholder="Person contacts"
                         margin="normal"
                         onChange={this.handleChange} />
            <Button type="submit" variant="contained" color="primary">
              Add
            </Button>
          </form>
        </div>
      )
    }
}
