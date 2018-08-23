import React, { Component } from 'react';
import './create.css';
import Button from '@material-ui/core/Button';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
// import axios from 'axios';
import api from '../../api';

export class Create extends Component {
    state = {}

  // componentWillMount() {
  //   this.setState({
  //     lat: this.props.lat,
  //     lng: this.props.lng,
  //     address_to: this.props.address
  //   })
  // }

    handleChange = event => {
      const email = event.target.value;
      this.setState({ email });

      console.log(this.state);
    }

    handleSubmit = event => {
      event.preventDefault();

      const orders = {
        contacts: this.state.email,
        point_from: { type: 'Point', coordinates: [this.props.lat_from, this.props.lng_from]},
        address_from: this.props.address_from,
        point_to: { type: 'Point', coordinates: [this.props.lat_to, this.props.lng_to]},
        address_to: this.props.address_to,
        travel_time: this.props.travel_time,
        status: 'in stock'
      };

      console.log(orders);

      api().post(`/api/orders`, orders)
        .then(res => {
          console.log(res);
          console.log(res.data);
        })
    }

    render() {
      const { email } = this.state;
      return (
        <div>
          <ValidatorForm
            ref="form"
            onSubmit={this.handleSubmit}
            onError={errors => console.log(errors)}
          >
            <TextValidator
              style={{padding: 24, width: '80%'}}
              margin="normal"
              placeholder="Person email"
              onChange={this.handleChange}
              name="email"
              value={email}
              validators={['required', 'isEmail']}
              errorMessages={['this field is required', 'email is not valid']}
            />
            <Button type="submit" variant="contained" color="primary">Add</Button>
          </ValidatorForm>
        </div>
      )
    }
}
