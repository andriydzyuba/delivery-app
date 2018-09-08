import React, { Component } from "react";

export default class Footer extends Component {

  render() {
    const style = {
      backgroundColor: "#F8F8F8",
      borderTop: "1px solid #E7E7E7",
      textAlign: "center",
      padding: "18px",
      position: "fixed",
      left: "0",
      bottom: "0",
      height: "18px",
      width: "100%",
      fontFamily: 'Roboto'
    }

    return (
      <div>
        <div style={style}>
          &copy; 2018 - DELIVERY APP
        </div>
      </div>
    );
  }
}
