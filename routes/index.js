var express = require('express');
var upload = require('./upload');
var user = require('./user');
var adminRouter = require('./admin');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/jukepi', function(err) {
    if (err) throw err;
    console.log('Connected to mongo')
});
module.exports = function(app) {
    upload(app);
    user(app);
    app.use('/admin', adminRouter);
}
