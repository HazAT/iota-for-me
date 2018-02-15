const admin = require('firebase-admin');
const functions = require('firebase-functions');
admin.initializeApp(functions.config().firebase);

const { public, api } = require('./app');
exports.public = public;
exports.api = api;
