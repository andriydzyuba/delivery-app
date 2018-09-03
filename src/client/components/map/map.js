import React from "react"
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import Geocode from "react-geocode";
import { Create } from "../create/create"
import { RenderMap } from "./rendermap"
import TextField from "@material-ui/core/TextField";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  paper: {
    display: 'flex',
    width: '92%',
    marginLeft: '25px',
  },
  item: {
    width: '100%',
    padding: '5px 10px',
  } ,
});

class CreateComponent extends React.PureComponent {
  state = {
    isMarkerShownFrom: false,
    isMarkerShownTo: false,
    isDirections: false,
    lat_from: null,
    lng_from: null,
    address_from: 'вулиця Патона, 6, Львів, Львівська область, Україна, 79000',
    lat_to: null,
    lng_to: null,
    address_to: '',
    travel_time: 0,
    travel_distance: 0,
    directions: null,
    search_from: '',
    search_to: '',
    click: 0
  }

  CheckTimeFrom = (lat, lng) => {
    const DirectionsService = new google.maps.DirectionsService();

    DirectionsService.route({
      origin: new google.maps.LatLng(lat, lng),
      destination: new google.maps.LatLng(this.state.lat_to, this.state.lng_to),
      travelMode: google.maps.TravelMode.DRIVING,
    }, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        let point = result.routes[ 0 ].legs[ 0 ];
        console.log(point.distance.value);
        console.log(point.duration.value);
        this.setState({
          travel_time: point.duration.value,
          travel_distance: point.distance.value,
          directions: result
        });
      }
    });
  };

  CheckTimeTo = (lat, lng) => {
    const DirectionsService = new google.maps.DirectionsService();

    DirectionsService.route({
      origin: new google.maps.LatLng(this.state.lat_from, this.state.lng_from),
      destination: new google.maps.LatLng(lat, lng),
      travelMode: google.maps.TravelMode.DRIVING,
    }, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        let point = result.routes[ 0 ].legs[ 0 ];
        console.log(point.distance.value);
        console.log(point.duration.value);
        this.setState({
          travel_time: point.duration.value,
          travel_distance: point.distance.value,
          directions: result
        });
      }
    });
  };

  clickSwitch = event => {
      let clickFun = [this.handleClickFrom, this.handleClickTo];
      if (this.state.click === 0) {
        let activeFun = clickFun[0];
        this.setState({click: 1});
        activeFun(event);
      } else {
        let activeFun = clickFun[1];
        this.setState({click: 0});
        activeFun(event);
      }
  }

  handleClickFrom = event => {
    let lat = event.latLng.lat();
    let lng = event.latLng.lng();
    console.log("A");
    // Geocode.setApiKey('AIzaSyDsPZNXy11aKhMyvS1O_2S4dUSbkgOXOzo'); Key for Google Maps API and Geocoding API
    // Geocode.setApiKey('AIzaSyAAnvKAk5sgTpNw9-0xXlFbYXA5uQlSUo4'); Key for Geocoding API
    // Geocode.setApiKey('AIzaSyAIDeLxxU2MakRH0MHEmXn5mccyGKYIsz4'); Key for Geocoding API (another project)
    Geocode.fromLatLng(lat, lng).then(
      response => {
        const address = response.results[0].formatted_address;
        this.setState({
          address_from: address,
          search_from: address
        });
      },
      error => {
        console.error(error);
      }
    );

    this.CheckTimeFrom(lat, lng);
    // this.mapZoom();

    this.setState({
      isMarkerShownFrom: true,
      isDirections: true,
      lat_from: lat,
      lng_from: lng
    });
  }

  handleClickTo = event => {
    let lat = event.latLng.lat();
    let lng = event.latLng.lng();
    console.log("B");
    Geocode.fromLatLng(lat, lng).then(
      response => {
        const address = response.results[0].formatted_address;
        this.setState({
          address_to: address,
          search_to: address
        });
      },
      error => {
        console.error(error);
      }
    );

    this.CheckTimeTo(lat, lng);
    // this.mapZoom();

    this.setState({
      isMarkerShownTo: true,
      isDirections: true,
      lat_to: lat,
      lng_to: lng
    });
  }

  handleChangeFrom = search_from => {
    this.setState({ search_from });
  }

  handleSelectFrom = address => {
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        console.log("A");
        console.log(lat, lng);

        this.CheckTimeFrom(lat, lng);

        this.setState({
          isMarkerShownFrom: true,
          isDirections: true,
          lat_from: lat,
          lng_from: lng,
          address_from: address,
          search_from: address
        });
      })
      .catch(error => console.error('Error', error));
  }

  handleChangeTo = search_to => {
    this.setState({ search_to });
  }

  handleSelectTo = address => {
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        console.log("B");
        console.log(lat, lng);

        this.CheckTimeTo(lat, lng);

        this.setState({
          isMarkerShownTo: true,
          isDirections: true,
          lat_to: lat,
          lng_to: lng,
          address_to: address,
          search_to: address
        });
      })
      .catch(error => console.error('Error', error));
  }

  componentDidMount() {
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <RenderMap
          onMapClick={this.clickSwitch}

          isMarkerShownFrom={this.state.isMarkerShownFrom}
          isMarkerShownTo={this.state.isMarkerShownTo}
          isDirections={this.state.isDirections}

          lat_from={this.state.lat_from}
          lng_from={this.state.lng_from}
          lat_to={this.state.lat_to}
          lng_to={this.state.lng_to}

          directions={this.state.directions}
        />
        <br/>
        <Grid container spacing={16}>
          <Grid item xs={6}>
            <PlacesAutocomplete
              value={this.state.search_from}
              onChange={this.handleChangeFrom}
              onSelect={this.handleSelectFrom}
            >
              {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <div>
                  <TextField style={{padding: '24px', width: '92%'}}
                             placeholder="Search Start Places ..."
                             margin="normal"
                             {...getInputProps()}
                  />
                  <div>
                    {loading && <div>Loading...</div>}
                    {suggestions.map(suggestion => {
                      return (
                        <Paper className={classes.paper} {...getSuggestionItemProps(suggestion)}>
                          <Button className={classes.item}>{suggestion.description}</Button>
                        </Paper>
                      );
                    })}
                  </div>
                </div>
              )}
            </PlacesAutocomplete>
          </Grid>
          <Grid item xs={6}>
            <PlacesAutocomplete
              value={this.state.search_to}
              onChange={this.handleChangeTo}
              onSelect={this.handleSelectTo}
            >
              {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <div>
                  <TextField style={{padding: '24px', width: '92%'}}
                             placeholder="Search Finish Places ..."
                             margin="normal"
                             {...getInputProps()}
                  />
                  <div>
                    {loading && <div>Loading...</div>}
                    {suggestions.map(suggestion => {
                      return (
                        <Paper className={classes.paper} {...getSuggestionItemProps(suggestion)}>
                          <Button className={classes.item}>{suggestion.description}</Button>
                        </Paper>
                      );
                    })}
                  </div>
                </div>
              )}
            </PlacesAutocomplete>
          </Grid>
        </Grid>
        <Create lat_from={this.state.lat_from} lng_from={this.state.lng_from} address_from={this.state.address_from}
                lat_to={this.state.lat_to} lng_to={this.state.lng_to} address_to={this.state.address_to}
                travel_time={this.state.travel_time}
        />
      </div>
    )
  }
}

export default withStyles(styles)(CreateComponent);
