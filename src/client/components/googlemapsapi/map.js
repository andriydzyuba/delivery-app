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

class Map extends React.PureComponent {
  state = {
    isMarkerShown: false,
    lat: 49.828460,
    lng: 23.993185,
    address: '',
    search: ''
  }

  handleClick = event => {
    let lat = event.latLng.lat();
    let lng = event.latLng.lng();
    // Geocode.setApiKey('AIzaSyDsPZNXy11aKhMyvS1O_2S4dUSbkgOXOzo'); Key for Google Maps API and Geocoding API
    // Geocode.setApiKey('AIzaSyAAnvKAk5sgTpNw9-0xXlFbYXA5uQlSUo4'); Key for Geocoding API
    // Geocode.setApiKey('AIzaSyAIDeLxxU2MakRH0MHEmXn5mccyGKYIsz4'); Key for Geocoding API (another project)
    Geocode.fromLatLng(lat, lng).then(
      response => {
        const address = response.results[0].formatted_address;
        this.setState({address: address});
      },
      error => {
        console.error(error);
      }
    );
    this.setState({
      isMarkerShown: true,
      lat: lat,
      lng: lng
    });
  }

  componentDidMount() {
    // this.setState({ isMarkerShown: false })
  }

  handleChange = search => {
    this.setState({ search });
  }

  handleSelect = address => {
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        this.setState({
          isMarkerShown: true,
          lat: lat,
          lng: lng,
          address: address
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
        containerElement: <div style={{ height: `500px`}} />,
        mapElement: <div style={{ height: `100%` }} />,
      }),
      withScriptjs,
      withGoogleMap
    )((props) =>
      <GoogleMap
        defaultZoom={16}
        defaultCenter={{ lat: this.state.lat, lng: this.state.lng }}
        onClick={this.handleClick}
      >
        {props.isMarkerShown && <Marker position={{ lat: this.state.lat, lng: this.state.lng }} />}
      </GoogleMap>
    )

    return (
      <Grid container spacing={16}>
        <Grid item xs={6}>
          <MapComponent
            isMarkerShown={this.state.isMarkerShown}
          />
        </Grid>
        <Grid item xs={6}>
          <Create lat={this.state.lat} lng={this.state.lng} address={this.state.address} />
          <PlacesAutocomplete
            value={this.state.search}
            onChange={this.handleChange}
            onSelect={this.handleSelect}
          >
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
              <div>
                <TextField style={{padding: 24}}
                           placeholder="Search Places ..."
                           margin="normal"
                           {...getInputProps()}
                />
                {this.state.address && <h3 style={{padding: 24}}> {this.state.address} </h3>}
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
      </Grid>
    )
  }
}

export default Map