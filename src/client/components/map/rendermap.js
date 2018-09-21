import React from "react";
import {compose, withProps} from "recompose";
import {GoogleMap, DirectionsRenderer, Marker, withGoogleMap} from "react-google-maps";

export const RenderMap = compose(
  withProps({
    googleMapURL: "",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `796px`, width: '100%'}} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withGoogleMap
)((props) =>
  <GoogleMap
    defaultZoom={13}
    defaultCenter={new google.maps.LatLng(props.current_lat, props.current_lng)}
    onClick={props.onMapClick}
  >
    {!props.directions && props.isMarkerShownFrom && <Marker position={{ lat: props.lat_from, lng: props.lng_from }} />}
    {!props.directions && props.isMarkerShownTo && <Marker position={{ lat: props.lat_to, lng: props.lng_to }} />}
    {props.directions && <DirectionsRenderer directions={props.directions} />}
  </GoogleMap>
)
