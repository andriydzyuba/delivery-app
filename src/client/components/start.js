import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import {Link} from "react-router-dom";
import Button from "@material-ui/core/Button/Button";

const styles = theme => ({
  root: {
    width: '100%',
    fontSize: '5rem',
    textAlign: 'center',
    color: 'silver',
    paddingTop: '5%'
    },
  icon: {
    fontSize: '15rem',
    color: 'grey'
  },
  p: {
    marginTop: '20px',
    marginBottom: '60px'
  }
});

class StartComponent extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <LocalShippingIcon className={classes.icon} /><br/>
        <p className={classes.p}>Delivery App</p>
        <Link style={{textDecoration: 'none'}} to="/create">
          <Button style={{width: '25%', height: '70px', fontSize: '1.3rem'}} type="submit" variant="contained" color="primary">Start</Button>
        </Link><br/>
        <a style={{textDecoration: 'none'}} href={'http://localhost:5000/api-docs/'}>
          <Button style={{width: '25%', height: '70px', fontSize: '1.3rem'}} type="submit" variant="outlined" color="primary">API Doc</Button>
        </a>
      </div>
    )
  }
}

export default withStyles(styles)(StartComponent);
