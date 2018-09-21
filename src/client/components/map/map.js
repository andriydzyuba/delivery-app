import React from "react"
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
// import Geocode from "react-geocode";
import { Create } from "../create/create"
import { RenderMap } from "./rendermap"
import TextField from "@material-ui/core/TextField";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const styles = theme => ({
  paper: {
    display: 'flex',
    width: '95%',
    marginLeft: '20px',
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
    address_from: '',
    lat_to: null,
    lng_to: null,
    address_to: '',
    current_lat: null,
    current_lng: null,
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
    // Geocode.fromLatLng(lat, lng).then(
    //   response => {
    //     const address = response.results[0].formatted_address;
    //     this.setState({
    //       address_from: address,
    //       search_from: address
    //     });
    //   }
    // );

    const Geocoder = new google.maps.Geocoder();

      Geocoder.geocode({
        location: {lat: lat, lng: lng}
      }, (result, status) => {
        if (status === 'OK') {
            const address = result[0].formatted_address;
            this.setState({
                address_from: address,
                search_from: address
            });
        }
    });

    this.CheckTimeFrom(lat, lng);

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
    // Geocode.fromLatLng(lat, lng).then(
    //   response => {
    //     const address = response.results[0].formatted_address;
    //     this.setState({
    //       address_to: address,
    //       search_to: address
    //     });
    //   }
    // );

    const Geocoder = new google.maps.Geocoder();

    Geocoder.geocode({
        location: {lat: lat, lng: lng}
    }, (result, status) => {
        if (status === 'OK') {
            const address = result[0].formatted_address;
            this.setState({
                address_to: address,
                search_to: address
            });
        }
    });

    this.CheckTimeTo(lat, lng);

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
  }

  handleChangeTo = search_to => {
    this.setState({ search_to });
  }

  handleSelectTo = address => {
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        console.log("B");

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
  }

  componentWillMount(){
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          current_lat: position.coords.latitude,
          current_lng: position.coords.longitude,
          error: null,
        });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
    );
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Grid container spacing={8}>
          <Grid item xs={12} lg={5}>
            <PlacesAutocomplete
              value={this.state.search_from}
              onChange={this.handleChangeFrom}
              onSelect={this.handleSelectFrom}
            >
              {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <div>
                  <TextField style={{padding: '20px', width: '95%'}}
                             placeholder="Search Start Places ..."
                             margin="normal"
                             {...getInputProps()}
                  />
                  <div>
                    {loading && <LinearProgress style={{margin: '0 20px', width: '95%'}}/>}
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
            <PlacesAutocomplete
              value={this.state.search_to}
              onChange={this.handleChangeTo}
              onSelect={this.handleSelectTo}
            >
              {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <div>
                  <TextField style={{padding: '20px', width: '95%'}}
                             placeholder="Search Finish Places ..."
                             margin="normal"
                             {...getInputProps()}
                  />
                  <div>
                    {loading && <LinearProgress style={{margin: '0 20px', width: '95%'}}/>}
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
            <Create lat_from={this.state.lat_from} lng_from={this.state.lng_from} address_from={this.state.address_from}
                    lat_to={this.state.lat_to} lng_to={this.state.lng_to} address_to={this.state.address_to}
                    travel_time={this.state.travel_time}
            />
          </Grid>
          <Grid item xs={12} lg={7}>
            {this.state.current_lat === null &&
            <RenderMap
              onMapClick={this.clickSwitch}

              isMarkerShownFrom={this.state.isMarkerShownFrom}
              isMarkerShownTo={this.state.isMarkerShownTo}
              isDirections={this.state.isDirections}

              lat_from={this.state.lat_from}
              lng_from={this.state.lng_from}
              lat_to={this.state.lat_to}
              lng_to={this.state.lng_to}

              current_lat={49.839683}
              current_lng={24.029717}

              directions={this.state.directions}
            />}
            {this.state.current_lat !== null &&
            <RenderMap
              onMapClick={this.clickSwitch}

              isMarkerShownFrom={this.state.isMarkerShownFrom}
              isMarkerShownTo={this.state.isMarkerShownTo}
              isDirections={this.state.isDirections}

              lat_from={this.state.lat_from}
              lng_from={this.state.lng_from}
              lat_to={this.state.lat_to}
              lng_to={this.state.lng_to}

              current_lat={this.state.current_lat}
              current_lng={this.state.current_lng}

              directions={this.state.directions}
            />}
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default withStyles(styles)(CreateComponent);
