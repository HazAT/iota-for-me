import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import Typography from 'material-ui/Typography';
import Stepper, { Step, StepLabel } from 'material-ui/Stepper';
import IOTA from 'iota.lib.js';
import ReCAPTCHA from 'react-google-recaptcha';
import { storeAddress } from '../actions/storeAddress';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { appConfig } from '../config';
import green from 'material-ui/colors/green';
import grey from 'material-ui/colors/grey';

const styles = theme => ({
  wrapper: {
    margin: theme.spacing.unit,
    position: 'relative'
  },
  content: {
    display: 'flex',
    'flex-direction': 'column'
  },
  stepper: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 0,
    paddingRight: 0
  }),
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

class New extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      editUrlCopied: false,
      shareUrlCopied: false,
      finishedEditUrl: false,
      addressError: false,
      address: '',
      loading: false
    };
  }

  getSteps() {
    return ['Paste your address', 'Copy edit url', 'Share your donation link'];
  }

  calculateStep() {
    if (this.state.finishedEditUrl) {
      return 2;
    }
    if (this.props.address.result) {
      return 1;
    }
    return 0;
  }

  renderSteps(step) {
    switch (this.calculateStep()) {
      case 0:
        return this.renderStep1();
      case 1:
        return this.renderStep2();
      case 2:
        return this.renderStep3();
      default:
        return 'Unknown step';
    }
  }

  renderStep1() {
    let { classes, address } = this.props;
    let loading = address.loading;

    return (
      <React.Fragment>
        <Typography type="headline" component="h3" gutterBottom>
          Welcome @ IOTAfor.me
        </Typography>
        <Typography type="body2" gutterBottom>
          {`It is basically a link shortener for your IOTA donation address.`}
          <br />
          {`Paste in your address down below and receive an edit/share link to manage your address.`}
          <br />
          {`The link will stay the same while you can switch the address in the background.`}
        </Typography>
        <TextField
          label="IOTA Address"
          placeholder="paste your address to receive donations here"
          helperText="click next or press enter to continue"
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
            onChange={this.storeAddress}
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
            Next
            {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
          </Button>
        </div>
      </React.Fragment>
    );
  }

  renderStep2() {
    let { classes, address } = this.props;
    const buttonClassname = classNames({
      [classes.button]: true,
      [classes.buttonSuccess]: this.state.editUrlCopied
    });
    let editUrl = `${appConfig.baseUrl}/edit/${address.result.editUrl}`;
    return (
      <React.Fragment>
        <Typography type="headline" component="h3" gutterBottom>
          Nice! Your address has been stored.
        </Typography>
        <Typography type="body2" gutterBottom>
          {`Now please copy and store the link below.`}
          <br />
          {`With this link you are able to change your IOTA address while keeping the same share link.`}
        </Typography>
        <TextField
          label="Edit Url"
          helperText="copy this and store it in a safe place"
          fullWidth
          disabled={true}
          value={editUrl}
          margin="normal"
        />
        <div className={classes.bottom}>
          <Button
            className={classes.button}
            raised
            color="primary"
            onClick={this.finishEditUrl}
          >
            Got it!
          </Button>
          <CopyToClipboard
            text={editUrl}
            onCopy={() => this.setState({ editUrlCopied: true })}
          >
            <Button className={buttonClassname} raised color="primary">
              {this.state.editUrlCopied ? 'Copied' : 'Copy'}
            </Button>
          </CopyToClipboard>
        </div>
      </React.Fragment>
    );
  }

  renderStep3() {
    let { classes, address } = this.props;
    const buttonClassname = classNames({
      [classes.button]: true,
      [classes.buttonSuccess]: this.state.shareUrlCopied
    });
    let shareUrl = `${appConfig.baseUrl}/donate/${address.result.shareUrl}`;
    return (
      <React.Fragment>
        <Typography type="headline" component="h3" gutterBottom>
          Profit!
        </Typography>
        <Typography type="body2" gutterBottom>
          {`So that's it, share the url below and never worry about you wallet addresses anymore.`}
          <br />
          {`Everyone visiting this link will see the address you've entered before.`}
        </Typography>
        <TextField
          label="Share Url"
          helperText="share this with the world"
          fullWidth
          disabled={true}
          value={shareUrl}
          margin="normal"
        />
        <div className={classes.bottom}>
          <CopyToClipboard
            text={shareUrl}
            onCopy={() => this.setState({ shareUrlCopied: true })}
          >
            <Button className={buttonClassname} raised color="primary">
              {this.state.shareUrlCopied ? 'Copied' : 'Copy'}
            </Button>
          </CopyToClipboard>
        </div>
      </React.Fragment>
    );
  }

  captchaSolved = captcha => {
    this.props.requestNewAddress(captcha, this.state.address);
    gcaptcha.reset();
  };

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

  finishEditUrl = () => {
    this.setState({
      finishedEditUrl: true
    });
  };

  storeAddress = captcha => {
    this.props.storeAddress(captcha, this.state.address);
  };

  render() {
    let { classes } = this.props;

    return (
      <React.Fragment>
        <div className={classes.wrapper}>
          <Stepper className={classes.stepper} activeStep={this.calculateStep()}>
            {this.getSteps().map(label => {
              return (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          <div className={classes.content}>{this.renderSteps()}</div>
        </div>
      </React.Fragment>
    );
  }
}

New.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    address: state.address
  };
}

function mapDispatchToProps(dispatch) {
  return {
    storeAddress: (captcha, address) => dispatch(storeAddress(captcha, address))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(New));
