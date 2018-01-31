import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect, isLoaded, isEmpty, populate } from 'react-redux-firebase';
import { withStyles } from 'material-ui/styles';
import { CircularProgress, LinearProgress } from 'material-ui/Progress';
import grey from 'material-ui/colors/grey';
import Typography from 'material-ui/Typography';
import ReCAPTCHA from 'react-google-recaptcha';
import green from 'material-ui/colors/green';
import IOTA from 'iota.lib.js';
import { appConfig } from '../config';
import { storeAddress } from '../actions/storeAddress';
import { refreshBalance } from '../actions/iota';

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
  buttonProgress: {
    color: grey[50],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  },
  button: {
    margin: theme.spacing.unit,
    float: 'right'
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700]
    }
  }
});

let gcaptcha;

class Edit extends Component {
  state = {
    addressSet: false,
    addressError: false,
    address: '',
    loading: false
  };

  componentWillReceiveProps(nextProps) {
    if (
      this.state.addressSet === false &&
      nextProps.editPopulated &&
      nextProps.editPopulated[nextProps.url]
    ) {
      let address = nextProps.editPopulated[nextProps.url].address.address;
      this.setState({ address, addressSet: true });
      // nextProps.refreshBalance(address);
    }
  }

  validateAddress = e => {
    let address = e.target.value;
    let addressError = false;
    if (address.length > 0 && !new IOTA().valid.isAddress(address)) {
      addressError = true;
    }
    this.setState({ address, addressError });
  };

  finishAddress = (e, captcha) => {
    if (e && e.key === 'Enter' && !this.state.addressError && this.state.address) {
      e.preventDefault();
      captcha.execute();
    } else if (e.key === undefined && !this.state.addressError && this.state.address) {
      captcha.execute();
    }
  };

  updateAddress = captcha => {
    this.props.storeAddress(
      captcha,
      this.state.address,
      this.props.edit[this.props.url].address
    );
    gcaptcha.reset();
  };

  renderBalance() {
    let content = 'Loading...';
    if (this.props.balance.error !== undefined) {
      content = 'Error loading balance, reload page to try again';
    } else if (this.props.balance.result) {
      content = this.props.balance.result.formattedBalance;
    }
    return <Typography type="headline">Balance: {content}</Typography>;
  }

  renderAddress() {
    let { editPopulated, edit, classes, url, storeAddressState } = this.props;

    if (editPopulated === undefined || !isLoaded(editPopulated)) {
      return <LinearProgress />;
    }

    if (isEmpty(editPopulated) || !editPopulated[url]) {
      return (
        <Typography type="title" gutterBottom align="center">
          Sorry, link not found :(
        </Typography>
      );
    }

    let editObject = {
      ...editPopulated[url].address,
      ...edit[url]
    };

    let loading = storeAddressState.loading;
    let shareUrl = editObject.shareUrl;

    return (
      <div className={classes.content}>
        <Typography type="title" gutterBottom align="center">
          Update your IOTA wallet address
        </Typography>

        <TextField
          label="IOTA Address"
          placeholder="paste your address to receive donations here"
          helperText="people from now on will receive this address from your share url"
          fullWidth
          required
          disabled={loading}
          value={this.state.address}
          error={this.state.addressError}
          onChange={this.validateAddress}
          onKeyPress={e => this.finishAddress(e, gcaptcha)}
          margin="normal"
        />
        <div className={classes.bottom}>
          <ReCAPTCHA
            ref={el => {
              gcaptcha = el;
            }}
            size="invisible"
            sitekey={appConfig.googleRecaptchaSiteKey}
            onChange={this.updateAddress}
          />
          <Button
            className={classes.button}
            raised
            disabled={
              loading || this.state.addressError || this.state.address.length === 0
            }
            color="primary"
            onClick={e => this.finishAddress(e, gcaptcha)}
          >
            Update
            {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
          </Button>
          <Button
            size="small"
            raised
            color="primary"
            className={classes.button}
            href={`/donate/${shareUrl}`}
          >
            Goto Share page
          </Button>
        </div>
      </div>
    );
  }

  render() {
    return <React.Fragment>{this.renderAddress()}</React.Fragment>;
  }
}

const populates = [{ child: 'address', root: 'addresses' }];

function mapStateToProps(state, props) {
  return {
    editPopulated: populate(state.firebase, 'edits', populates),
    edit: state.firebase.data.edits,
    storeAddressState: state.address,
    balance: state.balance
  };
}

function mapDispatchToProps(dispatch) {
  return {
    storeAddress: (captcha, address, addressId) =>
      dispatch(storeAddress(captcha, address, addressId)),
    refreshBalance: address => dispatch(refreshBalance(address))
  };
}

export default compose(
  firebaseConnect((props, store) => {
    return [
      {
        path: `/edits/${props.url}`,
        populates
      },
      {
        path: `/edits/${props.url}`
      }
    ];
  }),
  connect(mapStateToProps, mapDispatchToProps)
)(withStyles(styles)(Edit));
