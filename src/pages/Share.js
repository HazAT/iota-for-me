import React, { Component } from 'react';
import Button from 'material-ui/Button';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect, isLoaded, isEmpty, populate } from 'react-redux-firebase';
import { withStyles } from 'material-ui/styles';
import { LinearProgress } from 'material-ui/Progress';
import Typography from 'material-ui/Typography';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import green from 'material-ui/colors/green';
import QRCode from 'qrcode.react';

const styles = theme => ({
  wrapper: {
    margin: theme.spacing.unit,
    position: 'relative'
  },
  content: {
    display: 'flex',
    'flex-direction': 'column'
  },
  top: {},
  bottom: {
    'justify-content': 'flex-end'
  },
  button: {
    float: 'right',
    width: 128,
    margin: '0 auto'
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700]
    }
  },
  qrCode: {
    margin: '12px auto'
  },
  address: {
    'word-wrap': 'break-word'
  }
});

class Share extends Component {
  state = {
    urlCopied: false
  };

  renderAddress() {
    let { share, classes, url } = this.props;

    const buttonClassname = classNames({
      [classes.button]: true,
      [classes.buttonSuccess]: this.state.urlCopied
    });

    if (share === undefined || !isLoaded(share)) {
      return <LinearProgress />;
    }

    if (isEmpty(share) || !share[url]) {
      return (
        <Typography type="title" gutterBottom align="center">
          Sorry, link not found :(
        </Typography>
      );
    }
    let address = share[url].address.address;

    return (
      <div className={classes.content}>
        <Typography type="title" gutterBottom align="center">
          Send your IOTA to
        </Typography>
        <Typography
          type="subheading"
          gutterBottom
          align="center"
          className={classes.address}
        >
          {address}
        </Typography>
        <CopyToClipboard text={address} onCopy={() => this.setState({ urlCopied: true })}>
          <Button className={buttonClassname} raised color="primary">
            {this.state.urlCopied ? 'Copied' : 'Copy'}
          </Button>
        </CopyToClipboard>
        <div className={classes.qrCode}>
          <QRCode value={address} size={320} />
        </div>
      </div>
    );
  }

  render() {
    return <React.Fragment>{this.renderAddress()}</React.Fragment>;
  }
}

const populates = [{ child: 'address', root: 'addresses' }];

export default compose(
  firebaseConnect((props, store) => {
    return [
      {
        path: `/shares/${props.url}`,
        populates
      }
    ];
  }),
  connect(({ firebase }) => {
    return {
      share: populate(firebase, 'shares', populates)
    };
  })
)(withStyles(styles)(Share));
