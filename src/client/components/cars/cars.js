import React, { Component } from 'react';
import moment from 'moment';
import api from '../../api';
import Paper from "@material-ui/core/Paper";
import {withStyles} from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import ListItem from "@material-ui/core/ListItem";
import FormatListNumberedIcon from "@material-ui/icons/FormatListNumbered";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import MailIcon from "@material-ui/icons/Mail";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import List from "@material-ui/core/List";

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

  handleClick = event => {
    event.preventDefault();

    const cars = {
      status: 'free'
    }

    api().post(`/api/cars`, cars)
      .then(res => {
        console.log(res);
        console.log(res.data);
      })
  }

  componentDidMount() {
    api().get(`/api/cars`)
      .then(res => {
        const cars = res.data;
        this.setState({ cars });
        console.log(res.data)
      })
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Button disabled={true} onClick={this.handleClick} variant="contained" color="primary">Add Car</Button>
        <br/><br/>
        <div className={classes.root}>
          <Grid container spacing={40}>
          {this.state.cars.map(cars => {
            return (
              <Grid item xs={12} md={6} lg={4} key={cars.id}>
                <Paper className={classes.paper}>
                  <Grid container spacing={8}>
                    <Grid item xs={4}>
                      {cars.status === 'free' &&
                        <Avatar className={classes.avatar} style={{backgroundColor: 'green'}}>
                          <LocalShippingIcon className={classes.icon}/>
                        </Avatar>}
                      {cars.status === 'busy' &&
                        <Avatar className={classes.avatar} style={{backgroundColor: 'red'}}>
                          <LocalShippingIcon className={classes.icon}/>
                        </Avatar>}
                    </Grid>
                    <Grid item xs={8}>
                      <List>
                        <ListItem>
                          <Avatar>
                            <FormatListNumberedIcon />
                          </Avatar>
                          <ListItemText primary="№ (id)" secondary={cars.id} />
                        </ListItem>
                        <li>
                          <Divider inset />
                        </li>
                        <ListItem>
                          <Avatar>
                            <MailIcon />
                          </Avatar>
                          <ListItemText primary="Status" secondary={cars.status} />
                        </ListItem>
                        <Divider inset component="li" />
                        <ListItem>
                          <Avatar>
                            <LocationOnIcon />
                          </Avatar>
                          <ListItemText primary="Available" secondary={moment(cars.available_at).format('LLL')} />
                        </ListItem>
                        <Divider inset component="li" />
                        <ListItem>
                          <Avatar>
                            <LocationOnIcon />
                          </Avatar>
                          {cars.OrderId === null && <ListItemText primary="Order № (id)" secondary='-' />}
                          {cars.OrderId !== null && <ListItemText primary="Order № (id)" secondary={cars.OrderId} />}
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
