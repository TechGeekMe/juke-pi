var express = require('express')
var session = require('express-session')
var routes = require('./routes')
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(session({
    cookie: {
        maxAge: 86400000
    },
    secret: 'jukepi',
    resave: false,
    saveUninitialized: true
}))
routes(app)
app.use(express.static('public'));
app.listen(3000, function() {
    console.log("Listening on port 3000");
});
