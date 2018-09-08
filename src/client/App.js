import React, { Component } from "react";
import MainRouter from './router';
import Footer from './components/footer';

export default class App extends Component {

  render() {
    return (
      <div>
        <MainRouter/>
        <br/><br/><br/><br/>
        <Footer/>
      </div>
    );
  }
}
