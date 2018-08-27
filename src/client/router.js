import React from 'react';
import { HashRouter as Router, Route, Link } from "react-router-dom";

import CreateComponent from './components/map/map';
import ListComponent from './components/orders/orders';
import CheckComponent from './components/check/check';

import Paper from '@material-ui/core/Paper'
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Grid from "@material-ui/core/Grid";

const MainRouter = () => (
  <Router>
    <Grid container spacing={8}>
      <Grid item xs={2}>
        <Paper>
          <MenuList style={{width: '100%'}}>
            <MenuItem><Link style={{textDecoration: 'none', fontSize: '1.2rem', color: 'black', paddingLeft: '10px'}} to="/">Create order</Link></MenuItem>
            <MenuItem><Link style={{textDecoration: 'none', fontSize: '1.2rem', color: 'black', paddingLeft: '10px'}} to="/check">Check order</Link></MenuItem>
            <MenuItem><Link style={{textDecoration: 'none', fontSize: '1.2rem', color: 'black', paddingLeft: '10px'}} to="/list">List orders</Link></MenuItem>
          </MenuList>
        </Paper>
      </Grid>
      <Grid item xs={10}>
        <Route exact path="/" component={CreateComponent} />
        <Route path="/check" component={CheckComponent} />
        <Route path="/list" component={ListComponent} />
      </Grid>
    </Grid>
  </Router>
);

export default MainRouter