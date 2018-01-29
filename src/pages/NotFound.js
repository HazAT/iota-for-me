import React from 'react';
import PropTypes from 'prop-types';

import Typography from 'material-ui/Typography';

import { withStyles } from 'material-ui/styles';
import { connect } from 'react-redux';

const styles = theme => ({});

class NotFound extends React.Component {
  render() {
    return (
      <Typography type="title" gutterBottom align="center">
        Sorry, link not found :(
      </Typography>
    );
  }
}

NotFound.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(NotFound));
