import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const styles = {
  root: {
    flexGrow: 1,
  },
};

function DelAppBar(props) {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography variant="title" color="inherit">
            Delivery App
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}

DelAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DelAppBar);