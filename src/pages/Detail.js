import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';

import Edit from './Edit';
import Share from './Share';

const styles = theme => ({
  wrapper: {
    position: 'relative'
  }
});

class Detail extends Component {
  render() {
    let { url, classes } = this.props;
    let share = true;
    if (url.length > 10) {
      share = false;
    }
    return (
      <div className={classes.wrapper}>
        {!share && <Edit {...this.props} url={url} />}
        {share && <Share {...this.props} url={url} />}
      </div>
    );
  }
}

Detail.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps(state, props) {
  return {
    url: props.match.params.id
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Detail));
