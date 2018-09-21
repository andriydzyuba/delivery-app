import React from "react";
import {compose, withProps} from "recompose";
import {GoogleMap, withGoogleMap, Marker} from "react-google-maps";

export const RenderMiniMap = compose(
  withProps({
    googleMapURL: "",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `390px`, width: '100%'}} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withGoogleMap
)((props) =>
  <GoogleMap
    defaultZoom={10}
    defaultCenter={new google.maps.LatLng(props.location[0], props.location[1])}
  >
    <Marker
      position={{lat: props.location[0], lng: props.location[1]}}
    />
  </GoogleMap>
)
