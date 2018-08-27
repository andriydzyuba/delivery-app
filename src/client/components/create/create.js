import React, { Component } from 'react';
import api from '../../api';
import Button from '@material-ui/core/Button';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

export class Create extends Component {
    state = {
      track_code: null,
      email: ''
    }

    handleChange = event => {
      // const email = event.target.value;
      this.setState({ email: event.target.value });

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
          this.setState({track_code: res.data.track_code});
          console.log(res);
          // console.log(res.data.travel_time);
        })
    }

    render() {
      // const { email } = this.state;
      return (
        <div>
          <Grid container spacing={16}>
            <Grid item xs={8}>
              <ValidatorForm
                ref="form"
                onSubmit={this.handleSubmit}
                onError={errors => console.log(errors)}
              >
                <TextValidator
                  style={{padding: '24px 7% 24px 24px', width: '69%'}}
                  margin="normal"
                  placeholder="Person email"
                  onChange={this.handleChange}
                  name="email"
                  value={this.state.email}
                  validators={['required', 'isEmail']}
                  errorMessages={['this field is required', 'email is not valid']}
                />
                <Button type="submit" variant="contained" color="primary">Add Order</Button>
              </ValidatorForm>
            </Grid>
            <Grid item xs={4}>
              {this.state.track_code && <div style={{margin: '30px 30% 0 0', fontSize: '1.2rem', color: 'dimgray'}}><Paper style={{padding: 12, textAlign: 'center'}}>Track code: { this.state.track_code }</Paper></div>}
            </Grid>
          </Grid>
        </div>
      )
    }
}
