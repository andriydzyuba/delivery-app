import React, { Component } from "react";
import DelAppBar from './components/header/header';
import Header from './router';

export default class App extends Component {

  render() {
    return (
      <div>
        <DelAppBar/>
        <br/>
        <Header/>
      </div>
    );
  }
}
