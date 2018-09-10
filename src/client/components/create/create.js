import React, { Component } from 'react';
import api from '../../api';
import Button from '@material-ui/core/Button';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Paper from "@material-ui/core/Paper";

export class Create extends Component {
    state = {
      track_code: null,
      email: '',
      button: false
    }

    handleChange = event => {
      this.setState({ email: event.target.value });
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
        status: 'waiting'
      };

      api().post(`/api/orders`, orders)
        .then(res => {
          this.setState({
            track_code: res.data.track_code,
            button: true
          });
        })
    }

    render() {
      return (
        <div>
          <ValidatorForm
            ref="form"
            onSubmit={this.handleSubmit}
            onError={errors => console.log(errors)}
          >
            <TextValidator
              style={{padding: '20px', width: '95%'}}
              margin="normal"
              placeholder="Person email"
              onChange={this.handleChange}
              name="email"
              value={this.state.email}
              validators={['required', 'isEmail']}
              errorMessages={['this field is required', 'email is not valid']}
            />
            <Button disabled={this.state.button} style={{margin: '20px', width: '95%'}} type="submit" variant="contained" color="primary">Add Order</Button>
          </ValidatorForm>
          {this.state.track_code && <div style={{margin: '24px', fontSize: '1.2rem', color: 'dimgray'}}>
            <Paper style={{padding: 16, textAlign: 'center'}}>Track code: { this.state.track_code }</Paper></div>}
        </div>
      )
    }
}
