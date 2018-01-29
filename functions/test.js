const IOTA = require('iota.lib.js');

var iota = new IOTA({
  host: 'https://nodes.thetangle.org',
  port: 443
});

iota.api.getBalances(
  [
    'WAGKEZNSOBW9OJQIADFGJPFKLYLKBHWF9WMNYUGOYPUPXQKMYMATKDNETABBZHDGCUKV9QHQSUFKWGGQ9NFA9EHTKX'
  ],
  10,
  (error, success) => {
    if (error) {
      console.error(error);
    } else {
      console.log(success);
    }
  }
);
