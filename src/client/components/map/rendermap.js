import React from "react";
import {compose, withProps} from "recompose";
import {GoogleMap, DirectionsRenderer, Marker, withGoogleMap, withScriptjs} from "react-google-maps";

export const RenderMap = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `600px`, width: '96%', margin: '0 2%' }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
)((props) =>
  <GoogleMap
    defaultZoom={14}
    defaultCenter={new google.maps.LatLng(49.839683, 24.029717)}
    onClick={props.onMapClick}
  >
    {!props.directions && props.isMarkerShownFrom && <Marker position={{ lat: props.lat_from, lng: props.lng_from }} />}
    {!props.directions && props.isMarkerShownTo && <Marker position={{ lat: props.lat_to, lng: props.lng_to }} />}
    {props.directions && <DirectionsRenderer directions={props.directions} />}
  </GoogleMap>
)