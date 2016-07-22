var express = require('express');
var upload = require('./upload');
var user = require('./user');
var adminRouter = require('./admin');
module.exports = function(app, io) {
    upload(app, io);
    user(app, io);
    app.use('/admin', adminRouter);
}
