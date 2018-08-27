import React, {Component} from "react";
import api from "../../api";
import {TextValidator, ValidatorForm} from "react-material-ui-form-validator";
import Button from "@material-ui/core/Button";
import {withStyles} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Paper from "@material-ui/core/Paper";

const styles = theme => ({
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});


class CheckComponent extends Component {
  state = {
    order: [],
    showOrder: false,
    track_code: ''
  }

  handleChange = event => {
    // const track_code = event.target.value;
    this.setState({ track_code: event.target.value });

    console.log(this.state);
  }

  handleSubmit = event => {
    event.preventDefault();

    api().get(`/api/check/`+this.state.track_code)
      .then(res => {
        const order = res.data;
        this.setState({ order });
        console.log(order)
      })
      .then (
        this.setState({ showOrder: true })
      )
  }

  render() {
    // const { track_code } = this.state;
    const { classes } = this.props;

    return (
      <div>
        <ValidatorForm
          ref="form"
          onSubmit={this.handleSubmit}
          onError={errors => console.log(errors)}
        >
          <TextValidator
            style={{padding: 24, width: '90%'}}
            margin="normal"
            placeholder="Person track code"
            onChange={this.handleChange}
            name="track_code"
            value={this.state.track_code}
            validators={['required', 'minStringLength:10', 'maxStringLength:10']}
            errorMessages={['this field is required', 'track code is not valid']}
          />
          <Button type="submit" variant="contained" color="primary">Add</Button>
        </ValidatorForm>
        <br/>
        {this.state.showOrder &&
          <div>
            <Paper className={classes.root}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>№</TableCell>
                    <TableCell>Contacts</TableCell>
                    <TableCell>Address (client)</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Travel Time (min)</TableCell>
                    <TableCell>Track Code</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                      <TableRow>
                        <TableCell>{this.state.order.id}</TableCell>
                        <TableCell>{this.state.order.contacts}</TableCell>
                        <TableCell>{this.state.order.address_to}</TableCell>
                        <TableCell>{this.state.order.date}</TableCell>
                        <TableCell>{this.state.order.status}</TableCell>
                        <TableCell>{(this.state.order.travel_time / 60).toFixed(2)}</TableCell>
                        <TableCell>{this.state.order.track_code}</TableCell>
                      </TableRow>
                </TableBody>
              </Table>
            </Paper>
          </div>
        }
      </div>
    )
  }
}

export default withStyles(styles)(CheckComponent);
