import React from 'react';
import { HashRouter as Router, Route, Link } from "react-router-dom";
import CreateComponent from './components/map/map';
import ListComponent from './components/orders/orders';
import CheckComponent from './components/check/check';
import CarsComponent from './components/cars/cars';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";

const MainRouter = () => (
  <Router>
    <div>
      <AppBar position="static" color="default">
        <Toolbar>
          {/*<Typography variant="title" color="inherit" style={{padding: '10px'}}>*/}
          {/*Delivery App*/}
          {/*</Typography>*/}
          <MenuItem><Link style={{textDecoration: 'none', fontSize: '1.2rem', color: 'black', padding: '10px'}} to="/">Create order</Link></MenuItem>
          <MenuItem><Link style={{textDecoration: 'none', fontSize: '1.2rem', color: 'black', padding: '10px'}} to="/check/:track_code">Check order</Link></MenuItem>
          <MenuItem><Link style={{textDecoration: 'none', fontSize: '1.2rem', color: 'black', padding: '10px'}} to="/cars">List cars</Link></MenuItem>
          <MenuItem><Link style={{textDecoration: 'none', fontSize: '1.2rem', color: 'black', padding: '10px'}} to="/orders">List orders</Link></MenuItem>
        </Toolbar>
      </AppBar>
      <br/>
      <Route exact path="/" component={CreateComponent} />
      <Route path="/check/:track_code" component={CheckComponent} />
      <Route path="/cars" component={CarsComponent} />
      <Route path="/orders" component={ListComponent} />
    </div>
  </Router>
);

export default MainRouter
