import React, { Component } from 'react';
import './orders.css';
import api from '../../api';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

class ListComponent extends Component {
  state = {
    orders: []
  }

  componentDidMount() {
    api().get(`/api/orders`)
      .then(res => {
        const orders = res.data;
        this.setState({ orders });
        console.log(res.data)
      })
  }

  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>№</TableCell>
              <TableCell>Contacts</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Travel Time</TableCell>
              <TableCell>Track Code</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.orders.map(orders => {
              return (
                <TableRow key={orders.id}>
                  <TableCell>{orders.id}</TableCell>
                  <TableCell>{orders.contacts}</TableCell>
                  <TableCell>{orders.address_to}</TableCell>
                  <TableCell>{orders.date}</TableCell>
                  <TableCell>{orders.status}</TableCell>
                  <TableCell>{orders.travel_time}</TableCell>
                  <TableCell>{orders.track_code}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    )
  }
}

export default withStyles(styles)(ListComponent);
