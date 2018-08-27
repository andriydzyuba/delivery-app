import React from "react"
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import Geocode from "react-geocode";
import { Create } from "../create/create"
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
    lat_from: 49.839683,
    lng_from: 24.029717,
    address_from: 'вулиця Патона, 6, Львів, Львівська область, Україна, 79000',
    lat_to: 49.839683,
    lng_to: 24.029717,
    address_to: '',
    travel_time: 0,
    travel_distance: 0,
    search_from: '',
    search_to: '',
    click: 0,
    zoom: () => {
      if (this.state.travel_distance < 7000){
        return 14;
      } else if (this.state.travel_distance > 7000 && this.state.travel_distance < 14000){
        return 13;
      } else if (this.state.travel_distance > 14000 && this.state.travel_distance < 25000) {
        return 12;
      } else if (this.state.travel_distance > 25000 && this.state.travel_distance < 50000) {
        return 11;
      } else if (this.state.travel_distance > 50000 && this.state.travel_distance < 100000) {
        return 10;
      } else if (this.state.travel_distance > 100000 && this.state.travel_distance < 250000) {
        return 9;
      } else if (this.state.travel_distance > 250000 && this.state.travel_distance < 500000) {
        return 8;
      } else if (this.state.travel_distance > 500000 && this.state.travel_distance < 1000000) {
        return 7;
      } else {
        return 6;
      }
    }
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
          travel_distance: point.distance.value
        });
      } else {
        console.error(`error fetching directions ${result}`);
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
          travel_distance: point.distance.value
        });
      } else {
        console.error(`error fetching directions ${result}`);
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

  // mapZoom = () => {
  //   this.setState({
  //     zoomToMarkers: map => {
  //       let bounds = new google.maps.LatLngBounds();
  //       let loc = new google.maps.LatLng(this.state.lat_from, this.state.lng_from);
  //       let loc2 = new google.maps.LatLng(this.state.lat_to, this.state.lng_to);
  //       bounds.extend (loc);
  //       bounds.extend(loc2);
  //       map.fitBounds(bounds);
  //     }
  //   })
  // }

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
      lat_from: lat,
      lng_from: lng
    });
  }

  handleClickTo = event => {
    let lat = event.latLng.lat();
    let lng = event.latLng.lng();
    console.log("B");
    // Geocode.setApiKey('AIzaSyDsPZNXy11aKhMyvS1O_2S4dUSbkgOXOzo'); Key for Google Maps API and Geocoding API
    // Geocode.setApiKey('AIzaSyAAnvKAk5sgTpNw9-0xXlFbYXA5uQlSUo4'); Key for Geocoding API
    // Geocode.setApiKey('AIzaSyAIDeLxxU2MakRH0MHEmXn5mccyGKYIsz4'); Key for Geocoding API (another project)
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
        console.log(lat, lng);

        this.CheckTimeFrom(lat, lng);
        // this.mapZoom();

        this.setState({
          isMarkerShownFrom: true,
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
        console.log(lat, lng);

        this.CheckTimeTo(lat, lng);
        // this.mapZoom();

        this.setState({
          isMarkerShownTo: true,
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

    const MapComponent = compose(
      withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=&libraries=geometry,drawing,places",
        // googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyDsPZNXy11aKhMyvS1O_2S4dUSbkgOXOzo&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `600px`, width: '96%', margin: '0 2%' }} />,
        mapElement: <div style={{ height: `100%` }} />,
      }),
      withScriptjs,
      withGoogleMap
    )((props) =>
      <GoogleMap
        // ref={this.state.zoomToMarkers}
        defaultZoom={this.state.zoom()}
        defaultCenter={{ lat: ((this.state.lat_from + this.state.lat_to) / 2), lng: ((this.state.lng_from + this.state.lng_to) / 2) }}
        onClick={this.clickSwitch}
      >
        {props.isMarkerShownFrom && <Marker position={{ lat: this.state.lat_from, lng: this.state.lng_from }} label={'A'} />}
        {props.isMarkerShownTo && <Marker position={{ lat: this.state.lat_to, lng: this.state.lng_to }} label={'B'} />}
      </GoogleMap>
    )

    return (
      <div>
        <MapComponent
          isMarkerShownFrom={this.state.isMarkerShownFrom}
          isMarkerShownTo={this.state.isMarkerShownTo}
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

// export default CreateComponent
export default withStyles(styles)(CreateComponent);
