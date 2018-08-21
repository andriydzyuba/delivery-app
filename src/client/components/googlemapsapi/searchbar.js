import React from 'react';
import {GoogleApiWrapper} from 'google-maps-react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';

class LocationSearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { address: '' };
  }

  handleChange = address => {
    this.setState({ address });
  };

  handleSelect = address => {
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        this.setState({
          latitude: lat,
          longitude: lng,
          isGeocoding: false,
        });
      })
      .catch(error => console.error('Error', error));
  };

  render() {
    const {
        latitude,
        longitude,
        isGeocoding,
    } = this.state;

    return (
      <div>
      <PlacesAutocomplete
        value={this.state.address}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input
              {...getInputProps({
                placeholder: 'Search Places ...',
              })}
            />
            <div>
              {loading && <div>Loading...</div>}
              {suggestions.map(suggestion => {
                return (
                  <div
                    {...getSuggestionItemProps(suggestion)}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>

      {((latitude && longitude) || isGeocoding) && (
        <div>
          <h3>Geocode result</h3>
          <div>
            <div>
              <label>Latitude:</label>
              <span>{latitude}</span>
            </div>
            <div>
              <label>Longitude:</label>
              <span>{longitude}</span>
            </div>
          </div>
        </div>
      )}
  </div>
    );
  }
}

// export default LocationSearchInput;
export default GoogleApiWrapper({
  apiKey: ('')
})(LocationSearchInput)
