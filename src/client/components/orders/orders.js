import React, { Component } from 'react';
import moment from 'moment';
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
    minWidth: 1200,
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
              <TableCell>Address (client)</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date Estimated</TableCell>
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
                  <TableCell>{moment(orders.date).format('LLL')}</TableCell>
                  <TableCell>{orders.status}</TableCell>
                  <TableCell>{moment(orders.date_estimated).format('LLL')}</TableCell>
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
