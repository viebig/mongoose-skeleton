'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

mongoose.connect(process.env.MONGO_HOST + '/' + process.env.MONGO_SCHEMA, (err) => {

    if (err) {
        console.log(err);
    }

    console.log('Connected on MongoDB:', process.env.MONGO_HOST);
});

mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open to ' + process.env.MONGO_HOST);
});


mongoose.connection.on('error', function (err) {
  console.log('Mongoose default connection error: ' + err);
});


mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected');
});
