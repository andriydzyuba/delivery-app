import React from 'react';
import { HashRouter as Router, Route, NavLink } from "react-router-dom";
import StartComponent from './components/start';
import CreateComponent from './components/map/map';
import ListComponent from './components/orders/orders';
import CheckComponent from './components/check/check';
import CarsComponent from './components/cars/cars';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";

const MainRouter = () => (
  <Router>
    <div>
      <AppBar position="static" color="default">
        <Toolbar>
          <Grid container spacing={8}>
            <Grid item xs={6} sm={3} md={2} lg={2}>
              <NavLink style={{textDecoration: 'none', display:'block'}} activeStyle={{backgroundColor: 'silver'}} to="/create">
                <MenuItem style={{fontSize: '1.2rem', color: 'black', borderLeft: '1px solid silver', borderRight: '1px solid silver'}}>
                  Create order
                </MenuItem>
              </NavLink>
            </Grid>
            <Grid item xs={6} sm={3} md={2} lg={2}>
              <NavLink style={{textDecoration: 'none', display:'block'}} activeStyle={{backgroundColor: 'silver'}} to="/check/:track_code">
                <MenuItem style={{fontSize: '1.2rem', color: 'black', borderLeft: '1px solid silver', borderRight: '1px solid silver'}}>
                  Check order
                </MenuItem>
              </NavLink>
            </Grid>
            <Grid item xs={6} sm={3} md={2} lg={2}>
              <NavLink style={{textDecoration: 'none', display:'block'}} activeStyle={{backgroundColor: 'silver'}} to="/cars">
                <MenuItem style={{fontSize: '1.2rem', color: 'black', borderLeft: '1px solid silver', borderRight: '1px solid silver'}}>
                  List cars
                </MenuItem>
              </NavLink>
            </Grid>
            <Grid item xs={6} sm={3} md={2} lg={2}>
              <NavLink style={{textDecoration: 'none', display:'block'}} activeStyle={{backgroundColor: 'silver'}} to="/orders">
                <MenuItem style={{fontSize: '1.2rem', color: 'black', borderLeft: '1px solid silver', borderRight: '1px solid silver'}}>
                  List orders
                </MenuItem>
              </NavLink>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <br/>
      <Route exact path="/" component={StartComponent} />
      <Route path="/create" component={CreateComponent} />
      <Route path="/check/:track_code" component={CheckComponent} />
      <Route path="/cars" component={CarsComponent} />
      <Route path="/orders" component={ListComponent} />
    </div>
  </Router>
);

export default MainRouter
