var express = require('express')
var session = require('express-session')
var mongoose = require('mongoose');
var routes = require('./routes')
var app = express();
var bodyParser = require('body-parser');
var socket = require('./helpers/queue-socket');
app.use(bodyParser.json());
app.use(session({
    cookie: {
        maxAge: 86400000
    },
    secret: 'jukepi',
    resave: false,
    saveUninitialized: true
}))

mongoose.connect('mongodb://localhost/jukepi', function(err) {
    if (err) throw err;
    console.log('Connected to mongo')
});

var server = app.listen(3000, function() {
    console.log("Listening on port 3000");
});
socket.createConnection(server);
var io = socket.getConnection();
io.on('connection', function(socket) {
    console.log("hello");
})

io.on('log', function(data) {
    console.log('data');
})
routes(app, io)
app.use(express.static('public'));
