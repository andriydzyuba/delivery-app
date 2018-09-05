import React from "react";
import {compose, withProps} from "recompose";
import {GoogleMap, DirectionsRenderer, withGoogleMap} from "react-google-maps";

export const RenderMiniMap = compose(
  withProps({
    googleMapURL: "", //https://maps.googleapis.com/maps/api/js?key=&libraries=geometry,drawing,places
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `600px`, width: '100%'}} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withGoogleMap
)((props) =>
  <GoogleMap
    defaultZoom={13}
    defaultCenter={new google.maps.LatLng(49.839683, 24.029717)}
  >
    <DirectionsRenderer directions={props.directions} />
  </GoogleMap>
)