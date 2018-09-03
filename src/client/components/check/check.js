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
    order_param: [],
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

    api().get(`/api/check/` + this.state.track_code)
      .then(res => {
        const order = res.data;
        this.setState({ order });
        console.log(order)
      })
      .then (
        this.setState({ showOrder: true })
      )
  }

  componentDidMount() {
    api().get(`/api/check/` + this.props.match.params.track_code)
      .then(res => {
        const order_param = res.data;
        this.setState({ order_param });
      })
  }

  render() {
    // const { track_code } = this.state;
    const { classes } = this.props;
    console.log(this.props.match.params.track_code);

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
                    <TableCell>Address (store)</TableCell>
                    <TableCell>Address (client)</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date Estimated</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                      <TableRow>
                        <TableCell>{this.state.order.id}</TableCell>
                        <TableCell>{this.state.order.contacts}</TableCell>
                        <TableCell>{this.state.order.address_from}</TableCell>
                        <TableCell>{this.state.order.address_to}</TableCell>
                        <TableCell>{this.state.order.date}</TableCell>
                        <TableCell>{this.state.order.status}</TableCell>
                        <TableCell>{this.state.order.date_estimated}</TableCell>
                      </TableRow>
                </TableBody>
              </Table>
            </Paper>
          </div>
        }
        {!this.state.showOrder && this.props.match.params.track_code !== ':track_code' &&
        <div>
          <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>№</TableCell>
                  <TableCell>Contacts</TableCell>
                  <TableCell>Address (store)</TableCell>
                  <TableCell>Address (client)</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date Estimated</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{this.state.order_param.id}</TableCell>
                  <TableCell>{this.state.order_param.contacts}</TableCell>
                  <TableCell>{this.state.order_param.address_from}</TableCell>
                  <TableCell>{this.state.order_param.address_to}</TableCell>
                  <TableCell>{this.state.order_param.date}</TableCell>
                  <TableCell>{this.state.order_param.status}</TableCell>
                  <TableCell>{this.state.order_param.date_estimated}</TableCell>
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
