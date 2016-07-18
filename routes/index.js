var express = require('express');
var multer = require('../helpers/multer-storage');
var upload = require('./upload');
var user = require('./user');
var adminRouter = require('./admin');
module.exports = function(app) {
    upload(app);
    user(app);
    app.use('/admin', adminRouter);
}
