import React, { Component } from 'react';
import moment from 'moment';
import api from '../../api';
import { RenderMiniMap } from "./minimap"
import Paper from "@material-ui/core/Paper";
import {withStyles} from "@material-ui/core/styles";
// import Button from '@material-ui/core/Button';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import ListItem from "@material-ui/core/ListItem";
import FormatListNumberedIcon from "@material-ui/icons/FormatListNumbered";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import TimerIcon from "@material-ui/icons/Timer";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import List from "@material-ui/core/List";
import LocationOnIcon from "@material-ui/icons/LocationOn";

const styles = theme => ({
  root: {
    width: '100%'
  },
  avatar: {
    width: '120px',
    height: '120px',
    margin: '20% auto auto 20%'
  },
  icon: {
    fontSize: '90px'
  }
});

class CarsComponent extends Component {
  state = {
    cars: []
  }

  // handleClick = event => {
  //   event.preventDefault();
  //
  //   const cars = {
  //     status: 'free',
  //     location: 'Львів, Львівська область, Україна',
  //     location_check: 'Львів, Львівська область, Україна',
  //     point: { type: 'Point', coordinates: [49.839683, 24.029717]}
  //   }
  //
  //   api().post(`/api/cars`, cars)
  //     .then(res => {
  //       console.log(res);
  //       console.log(res.data);
  //     })
  // }

  componentDidMount() {
    api().get(`/api/cars`)
      .then(res => {
        const cars = res.data;
        this.setState({ cars });
      })
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        {/*<Button disabled={false} onClick={this.handleClick} variant="contained" color="primary">Add Car</Button>*/}
        {/*<br/><br/>*/}
        <div className={classes.root}>
          <Grid container spacing={16}>
          {this.state.cars.map(cars => {
            return (
              <Grid item xs={12} lg={6} key={cars.id}>
                <Paper className={classes.paper}>
                  <Grid container spacing={8}>
                    <Grid item xs={12} md={6}>
                      <RenderMiniMap
                        location={cars.point.coordinates}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <List>
                        <ListItem>
                          <Avatar>
                            <FormatListNumberedIcon />
                          </Avatar>
                          {cars.special_car === true &&
                            <ListItemText primary="№ (id)" secondary={cars.id + ' - Long delivery car'} />
                          }
                          {cars.special_car === false &&
                            <ListItemText primary="№ (id)" secondary={cars.id + ' - Short delivery car'} />
                          }
                        </ListItem>
                        <li>
                          <Divider inset />
                        </li>
                        <ListItem>
                          {cars.status === 'free' &&
                            <Avatar style={{backgroundColor: 'green'}}>
                              <LocalShippingIcon />
                            </Avatar>}
                          {cars.status === 'busy' &&
                            <Avatar style={{backgroundColor: 'red'}}>
                              <LocalShippingIcon />
                            </Avatar>}
                          <ListItemText primary="Status" secondary={cars.status} />
                        </ListItem>
                        <Divider inset component="li" />
                        <ListItem>
                          <Avatar>
                            <TimerIcon />
                          </Avatar>
                          <ListItemText primary="Available" secondary={moment(cars.available_at).format('LLL')} />
                        </ListItem>
                        <Divider inset component="li" />
                        <ListItem>
                          <Avatar>
                            <ShoppingCartIcon />
                          </Avatar>
                          {cars.OrderId === null && <ListItemText primary="Order № (id)" secondary='-' />}
                          {cars.OrderId !== null && <ListItemText primary="Order № (id)" secondary={cars.OrderId} />}
                        </ListItem>
                        <Divider inset component="li" />
                        <ListItem>
                          <Avatar>
                            <LocationOnIcon />
                          </Avatar>
                          <ListItemText primary="Finish location" secondary={cars.location} />
                        </ListItem>
                      </List>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            );
          })}
          </Grid>
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(CarsComponent);
