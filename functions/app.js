const functions = require('firebase-functions');
const admin = require('firebase-admin');

const express = require('express');
const cors = require('cors');

const shortid = require('shortid');
const randomstring = require('randomstring');
const rp = require('request-promise');

const IOTA = require('iota.lib.js');

const captchaEndpoint = express();
const publicEndpoint = express();

const validateRecaptcha = (req, res, next) => {
  let captcha;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    console.log('Found "Authorization" header for captcha');
    captcha = req.headers.authorization.split('Bearer ')[1];
  } else {
    res.status(403).send('Unauthorized');
    return;
  }

  rp({
    uri: 'https://recaptcha.google.com/recaptcha/api/siteverify',
    method: 'POST',
    formData: {
      secret: functions.config().recaptcha.secret,
      response: captcha
    },
    json: true
  }).then(result => {
    if (result.success) {
      console.log('Captcha successfully validated');
      next();
    } else {
      console.error('Captcha failed');
      res.status(400).send('Captcha failed');
      return;
    }
  });
};

captchaEndpoint.use(cors({ origin: true }));
captchaEndpoint.use(validateRecaptcha);

captchaEndpoint.options('*');
captchaEndpoint.post('/storeAddress', (req, res) => {
  let address = req.body.address;
  if (!new IOTA().valid.isAddress(address)) {
    res.status(400).send('No valid IOTA address');
  }
  let addressId = req.body.addressId;
  if (addressId) {
    // Update
    admin
      .database()
      .ref('/addresses')
      .child(addressId)
      .update({ address })
      .then(() => {
        res.send({ address });
      });
  } else {
    const shareUrl = shortid.generate();
    const editUrl = randomstring.generate(64);
    const entry = {
      address,
      shareUrl,
      createdAt: admin.database.ServerValue.TIMESTAMP
    };
    admin
      .database()
      .ref('/addresses')
      .push(entry)
      .then(newAddress => {
        return admin
          .database()
          .ref('/shares')
          .child(shareUrl)
          .set({ address: newAddress.key })
          .then(() =>
            admin
              .database()
              .ref('/edits')
              .child(editUrl)
              .set({ address: newAddress.key })
          );
      })
      .then(() => res.send(Object.assign(entry, { editUrl: editUrl })))
      .catch(e => res.status(400).send(e));
  }
});

publicEndpoint.use(cors({ origin: true }));
publicEndpoint.options('*');
publicEndpoint.post('/getBalance', (req, res) => {
  let addressId = req.body.addressId;
  admin
    .database()
    .ref('/addresses')
    .child(addressId)
    .once('value')
    .then(snapshot => {
      var address = snapshot.val();
      var iota = new IOTA({
        host: 'http://nodes.iota.fm',
        port: 80
      });

      iota.api.getBalances([address.address], 10, (error, success) => {
        if (error) {
          res.status(400).send(error);
        } else {
          res.send(success);
        }
      });
    });
});

exports.public = functions.https.onRequest(captchaEndpoint);
exports.api = functions.https.onRequest(publicEndpoint);
