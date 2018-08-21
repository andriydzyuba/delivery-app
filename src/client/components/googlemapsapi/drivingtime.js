/* global google */

import React from "react"

class DrivingTime extends React.Component {
  state = {
    latitude_from: 49.81707,
    longitude_from: 24.07744290000005,
    latitude_to: 49.8831229,
    longitude_to: 23.468370499999992
  }

  componentDidMount() {
    const origin = new google.maps.LatLng( this.state.latitude_from, this.state.longitude_from ); // using google.maps.LatLng class
    const destination = new google.maps.LatLng( this.state.latitude_to, this.state.longitude_to ); // using google.maps.LatLng class

    const directionsService = new google.maps.DirectionsService();
    const request = {
      origin: origin, // LatLng|string
      destination: destination, // LatLng|string
      travelMode: google.maps.DirectionsTravelMode.DRIVING
    };

    directionsService.route( request, function( response, status ) {

      if ( status === 'OK' ) {
        let point = response.routes[ 0 ].legs[ 0 ];
        console.log(point.duration.text);
        console.log(point.distance.text);
      } else {
        console.log(status);
      }
    } );
  }

  render() {
    return (
      <div></div>
    )
  }
}

export default DrivingTime