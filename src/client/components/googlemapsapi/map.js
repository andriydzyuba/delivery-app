import React from "react"
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import Geocode from "react-geocode";
import { Create } from "../create/create"
import TextField from "@material-ui/core/TextField";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';


class CreateComponent extends React.PureComponent {
  state = {
    isMarkerShown: false,
    lat_from: 49.8239611,
    lng_from: 23.9550712,
    address_from: 'вулиця Патона, 6, Львів, Львівська область, Україна, 79000',
    lat_to: 49.828460,
    lng_to: 23.993185,
    address_to: '',
    travel_time: 0,
    search: ''
  }

  CheckTime = (lat, lng) => {
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
        });
      } else {
        console.error(`error fetching directions ${result}`);
      }
    });
  };

  handleClick = event => {
    let lat = event.latLng.lat();
    let lng = event.latLng.lng();
    // Geocode.setApiKey('AIzaSyDsPZNXy11aKhMyvS1O_2S4dUSbkgOXOzo'); Key for Google Maps API and Geocoding API
    // Geocode.setApiKey('AIzaSyAAnvKAk5sgTpNw9-0xXlFbYXA5uQlSUo4'); Key for Geocoding API
    // Geocode.setApiKey('AIzaSyAIDeLxxU2MakRH0MHEmXn5mccyGKYIsz4'); Key for Geocoding API (another project)
    Geocode.fromLatLng(lat, lng).then(
      response => {
        const address = response.results[0].formatted_address;
        this.setState({
          address_to: address,
          search: address
        });
      },
      error => {
        console.error(error);
      }
    );

    this.CheckTime(lat, lng);

    // const DirectionsService = new google.maps.DirectionsService();
    //
    // DirectionsService.route({
    //   origin: new google.maps.LatLng(this.state.lat_from, this.state.lng_from),
    //   destination: new google.maps.LatLng(lat, lng),
    //   travelMode: google.maps.TravelMode.DRIVING,
    // }, (result, status) => {
    //   if (status === google.maps.DirectionsStatus.OK) {
    //     let point = result.routes[ 0 ].legs[ 0 ];
    //     this.setState({
    //       travel_time: point.duration.value,
    //     });
    //   } else {
    //     console.error(`error fetching directions ${result}`);
    //   }
    // });

    this.setState({
      isMarkerShown: true,
      lat_to: lat,
      lng_to: lng
    });
  }

  componentDidMount() {
  }

  handleChange = search => {
    this.setState({ search });
  }

  handleSelect = address => {
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(({ lat, lng }) => {

        this.CheckTime(lat, lng);

        // const DirectionsService = new google.maps.DirectionsService();
        //
        // DirectionsService.route({
        //   origin: new google.maps.LatLng(this.state.lat_from, this.state.lng_from),
        //   destination: new google.maps.LatLng(lat, lng),
        //   travelMode: google.maps.TravelMode.DRIVING,
        // }, (result, status) => {
        //   if (status === google.maps.DirectionsStatus.OK) {
        //     let point = result.routes[ 0 ].legs[ 0 ];
        //     this.setState({
        //       travel_time: point.duration.value,
        //     });
        //   } else {
        //     console.error(`error fetching directions ${result}`);
        //   }
        // });

        this.setState({
          isMarkerShown: true,
          lat_to: lat,
          lng_to: lng,
          address_to: address,
          search: address
        });
      })
      .catch(error => console.error('Error', error));
  }

  render() {

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
        defaultZoom={16}
        defaultCenter={{ lat: this.state.lat_to, lng: this.state.lng_to }}
        onClick={this.handleClick}
      >
        {props.isMarkerShown && <Marker position={{ lat: this.state.lat_to, lng: this.state.lng_to }} />}
      </GoogleMap>
    )

    return (
      <div>
        <MapComponent
          isMarkerShown={this.state.isMarkerShown}
        />
        <br/>
        <Grid container spacing={16}>
          <Grid item xs={6}>
            <PlacesAutocomplete
              value={this.state.search}
              onChange={this.handleChange}
              onSelect={this.handleSelect}
            >
              {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <div>
                  <TextField style={{padding: 24, width: '100%'}}
                             placeholder="Search Places ..."
                             margin="normal"
                             {...getInputProps()}
                  />
                  <div>
                    {loading && <div>Loading...</div>}
                    {suggestions.map(suggestion => {
                      return (
                        <List component="nav"
                              {...getSuggestionItemProps(suggestion)}>
                          <ListItem button>
                            {suggestion.description}
                          </ListItem>
                        </List>
                      );
                    })}
                  </div>
                </div>
              )}
            </PlacesAutocomplete>
          </Grid>
          <Grid item xs={6}>
            <Create lat_from={this.state.lat_from} lng_from={this.state.lng_from} address_from={this.state.address_from}
                    lat_to={this.state.lat_to} lng_to={this.state.lng_to} address_to={this.state.address_to}
                    travel_time={this.state.travel_time}
            />
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default CreateComponent
