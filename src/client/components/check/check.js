import React, {Component} from "react";
import moment from 'moment';
import api from "../../api";
import {TextValidator, ValidatorForm} from "react-material-ui-form-validator";
import { RenderMiniMap } from "./minimap"
import Button from "@material-ui/core/Button";
import {withStyles} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import MailIcon from '@material-ui/icons/Mail';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import LocationOffIcon from '@material-ui/icons/LocationOff';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import EditAttributesIcon from '@material-ui/icons/EditAttributes';
import StopIcon from '@material-ui/icons/Stop';
import CodeIcon from '@material-ui/icons/Code';
import Divider from '@material-ui/core/Divider';

const styles = theme => ({
  root: {
    width: '95%',
    margin: 'auto'
  }
});


class CheckComponent extends Component {
  state = {
    order: [],
    order_param: [],
    showOrder: false,
    track_code: '',
    directions: null,
    button: false,
    message: false,
    message_text: 'Order not found. Track code is incorrectly!'
  }

  handleChange = event => {
    this.setState({ track_code: event.target.value });
  }

  handleSubmit = event => {
    event.preventDefault();

    api().get(`/api/check/` + this.state.track_code)
      .then(res => {
        const order = res.data;
        if(res.data === null){
          this.setState({
            message: true,
            button: true
          });
        } else {
          this.setState({
            order: order,
            button: true
          });
        }
      })
      .then (
        this.setState({ showOrder: true })
      )
      .then(() => {
        const DirectionsService = new google.maps.DirectionsService();

        DirectionsService.route({
          origin: new google.maps.LatLng(this.state.order.point_from.coordinates[0], this.state.order.point_from.coordinates[1]),
          destination: new google.maps.LatLng(this.state.order.point_to.coordinates[0], this.state.order.point_to.coordinates[1]),
          travelMode: google.maps.TravelMode.DRIVING,
        }, (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            this.setState({
              directions: result
            });
          }
        })
      })
  }

  componentDidMount() {
    if (this.props.match.params.track_code !== ':track_code'){
    api().get(`/api/check/` + this.props.match.params.track_code)
      .then(res => {
        const order_param = res.data;
        if(res.data === null){
          this.setState({
            message: true,
            button: true
          });
        } else {
          this.setState({
            order_param: order_param,
            button: true
          });
        }
      })
      .then(() => {
        const DirectionsService = new google.maps.DirectionsService();

        DirectionsService.route({
          origin: new google.maps.LatLng(this.state.order_param.point_from.coordinates[0], this.state.order_param.point_from.coordinates[1]),
          destination: new google.maps.LatLng(this.state.order_param.point_to.coordinates[0], this.state.order_param.point_to.coordinates[1]),
          travelMode: google.maps.TravelMode.DRIVING,
        }, (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            this.setState({
              directions: result
            });
          }
        })
      })
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <ValidatorForm
          ref="form"
          onSubmit={this.handleSubmit}
          onError={errors => console.log(errors)}
          className={classes.root}
        >
          <Grid container spacing={8}>
            <Grid item xs={8} sm={9} md={10}>
              <TextValidator
                style={{padding: 24, width: '95%'}}
                margin="normal"
                placeholder="Person track code"
                onChange={this.handleChange}
                name="track_code"
                value={this.state.track_code}
                validators={['required', 'minStringLength:10', 'maxStringLength:10']}
                errorMessages={['this field is required', 'track code is not valid']}
              />
            </Grid>
            <Grid item xs={4} sm={3} md={2}>
              <Button disabled={this.state.button} style={{margin: '36px 0 12px 10px', width: '75%'}} type="submit" variant="contained" color="primary">Check</Button>
            </Grid>
          </Grid>
        </ValidatorForm>
        <br/>
        {this.state.showOrder && !this.state.message &&
        <div>
            <Paper className={classes.root}>
              <Grid container spacing={8}>
                <Grid item xs={12} md={6}>
                  <RenderMiniMap
                    directions={this.state.directions}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <List>
                    <ListItem>
                      <Avatar>
                        <FormatListNumberedIcon />
                      </Avatar>
                      <ListItemText primary="№ (id)" secondary={this.state.order.id} />
                    </ListItem>
                    <li>
                      <Divider inset />
                    </li>
                    <ListItem>
                      <Avatar>
                        <MailIcon />
                      </Avatar>
                      <ListItemText primary="Contacts" secondary={this.state.order.contacts} />
                    </ListItem>
                    <Divider inset component="li" />
                    <ListItem>
                      <Avatar>
                        <LocationOnIcon />
                      </Avatar>
                      <ListItemText primary="Address (shop)" secondary={this.state.order.address_from} />
                    </ListItem>
                    <Divider inset component="li" />
                    <ListItem>
                      <Avatar>
                        <LocationOffIcon />
                      </Avatar>
                      <ListItemText primary="Address (client)" secondary={this.state.order.address_to} />
                    </ListItem>
                    <Divider inset component="li" />
                    <ListItem>
                      <Avatar>
                        <PlayArrowIcon />
                      </Avatar>
                      <ListItemText primary="Date" secondary={moment(this.state.order.date).format('LLL')} />
                    </ListItem>
                    <Divider inset component="li" />
                    <ListItem>
                      {this.state.order.status === 'waiting' &&
                      <Avatar style={{backgroundColor: 'red'}}>
                        <EditAttributesIcon />
                      </Avatar>}
                      {this.state.order.status === 'processing' &&
                      <Avatar style={{backgroundColor: 'yellow'}}>
                        <EditAttributesIcon />
                      </Avatar>}
                      {this.state.order.status === 'delivered' &&
                      <Avatar style={{backgroundColor: 'green'}}>
                        <EditAttributesIcon />
                      </Avatar>}
                      <ListItemText primary="Status" secondary={this.state.order.status} />
                    </ListItem>
                    <Divider inset component="li" />
                    <ListItem>
                      <Avatar>
                        <StopIcon />
                      </Avatar>
                      <ListItemText primary="Date Estimated" secondary={moment(this.state.order.date_estimated).format('LLL')} />
                    </ListItem>
                    <Divider inset component="li" />
                    <ListItem>
                      <Avatar>
                        <CodeIcon />
                      </Avatar>
                      <ListItemText primary="Track Code" secondary={this.state.order.track_code} />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </Paper>
          </div>
        }
        {!this.state.showOrder && !this.state.message && this.props.match.params.track_code !== ':track_code' &&
        <div>
          <Paper className={classes.root}>
            <Grid container spacing={0}>
              <Grid item xxs={12} md={6}>
                <RenderMiniMap
                  directions={this.state.directions}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <List>
                  <ListItem>
                    <Avatar>
                      <FormatListNumberedIcon />
                    </Avatar>
                    <ListItemText primary="№ (id)" secondary={this.state.order_param.id} />
                  </ListItem>
                  <li>
                    <Divider inset />
                  </li>
                  <ListItem>
                    <Avatar>
                      <MailIcon />
                    </Avatar>
                    <ListItemText primary="Contacts" secondary={this.state.order_param.contacts} />
                  </ListItem>
                  <Divider inset component="li" />
                  <ListItem>
                    <Avatar>
                      <LocationOnIcon />
                    </Avatar>
                    <ListItemText primary="Address (client)" secondary={this.state.order_param.address_from} />
                  </ListItem>
                  <Divider inset component="li" />
                  <ListItem>
                    <Avatar>
                      <LocationOffIcon />
                    </Avatar>
                    <ListItemText primary="Address (client)" secondary={this.state.order_param.address_to} />
                  </ListItem>
                  <Divider inset component="li" />
                  <ListItem>
                    <Avatar>
                      <PlayArrowIcon />
                    </Avatar>
                    <ListItemText primary="Date" secondary={moment(this.state.order_param.date).format('LLL')} />
                  </ListItem>
                  <Divider inset component="li" />
                  <ListItem>
                    {this.state.order_param.status === 'waiting' &&
                    <Avatar style={{backgroundColor: 'red'}}>
                      <EditAttributesIcon />
                    </Avatar>}
                    {this.state.order_param.status === 'processing' &&
                    <Avatar style={{backgroundColor: 'yellow'}}>
                      <EditAttributesIcon />
                    </Avatar>}
                    {this.state.order_param.status === 'delivered' &&
                    <Avatar style={{backgroundColor: 'green'}}>
                      <EditAttributesIcon />
                    </Avatar>}
                    <ListItemText primary="Status" secondary={this.state.order_param.status} />
                  </ListItem>
                  <Divider inset component="li" />
                  <ListItem>
                    <Avatar>
                      <StopIcon />
                    </Avatar>
                    <ListItemText primary="Date Estimated" secondary={moment(this.state.order_param.date_estimated).format('LLL')} />
                  </ListItem>
                  <Divider inset component="li" />
                  <ListItem>
                    <Avatar>
                      <CodeIcon />
                    </Avatar>
                    <ListItemText primary="Track Code" secondary={this.state.order_param.track_code} />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </Paper>
        </div>
        }
        {this.state.message && <div style={{fontSize: '2rem', textAlign: 'center'}}><Paper style={{padding: '20px', width: '50%', margin: 'auto'}}> {this.state.message_text} </Paper></div> }
      </div>
    )
  }
}

export default withStyles(styles)(CheckComponent);
