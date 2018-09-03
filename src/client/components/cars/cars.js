import React, { Component } from 'react';
import api from '../../api';
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {withStyles} from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';

const styles = theme => ({
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

class CarsComponent extends Component {
  state = {
    cars: []
  }

  handleClick = event => {
    event.preventDefault();

    const cars = {
      status: 'free'
    }

    api().post(`/api/cars`, cars)
      .then(res => {
        console.log(res);
        console.log(res.data);
      })
  }

  componentDidMount() {
    api().get(`/api/cars`)
      .then(res => {
        const cars = res.data;
        this.setState({ cars });
        console.log(res.data)
      })
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Button disabled={true} onClick={this.handleClick} variant="contained" color="primary">Add Car</Button>
        <br/><br/>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>№</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Available</TableCell>
                <TableCell>Order (№)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.cars.map(cars => {
                return (
                  <TableRow key={cars.id}>
                    <TableCell>{cars.id}</TableCell>
                    <TableCell>{cars.status}</TableCell>
                    <TableCell>{cars.available_at}</TableCell>
                    <TableCell>{cars.OrderId}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      </div>
    )
  }
}

export default withStyles(styles)(CarsComponent);

// class CarsComponent extends Component {
//     state = {}
//
//     handleClick = event => {
//       event.preventDefault();
//
//       const cars = {
//         status: 'free',
//         available_at: '',
//         available: true,
//         OrderId: 3
//       }
//
//       api().post(`/api/cars`, cars)
//         .then(res => {
//           console.log(res);
//           console.log(res.data);
//         })
//     }
//
//     render() {
//       return (
//         <div>
//           <Button onClick={this.handleClick} variant="contained" color="primary">Add Car</Button>
//         </div>
//       )
//     }
// }
//
// export default CarsComponent
