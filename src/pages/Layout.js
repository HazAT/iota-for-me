import React from 'react';
import PropTypes from 'prop-types';

import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';

import { withStyles } from 'material-ui/styles';
import { connect } from 'react-redux';

import logo from '../assets/iota.png';

const styles = theme => ({
  root: theme.mixins.gutters({
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingTop: 32,
    paddingBottom: 32,
    maxWidth: 1024
  }),
  logo: {
    height: 42,
    marginBottom: 8
  },
  paper: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16
  }),
  donateLink: {
    color: 'white',
    display: 'block',
    marginTop: 6,
    marginLeft: 6
  },
  feedbackLink: {
    float: 'right',
    marginRight: 6
  }
});

class Layout extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <a href="/">
          <img
            src={logo}
            className={classes.logo}
            alt="IOTAfor.me create a donation link"
          />
        </a>
        <Paper className={classes.paper} elevation={4}>
          {this.props.children}
        </Paper>
        <Typography className={classes.donateLink} type="body2" gutterBottom>
          <a target="_blank" rel="noopener noreferrer" href="/donate/ThankYou">
            Support this project by donating IOTA
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            className={classes.feedbackLink}
            href="https://twitter.com/iotaforme"
          >
            Twitter
          </a>
          <span className={classes.feedbackLink}>|</span>
          <a
            target="_blank"
            rel="noopener noreferrer"
            className={classes.feedbackLink}
            href="https://github.com/HazAT/iota-for-me"
          >
            Github
          </a>
        </Typography>
      </div>
    );
  }
}

Layout.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Layout));
