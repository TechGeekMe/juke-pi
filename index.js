var express = require('express')
var session = require('express-session')
var mongoose = require('mongoose');
var routes = require('./routes')
var app = express();
var bodyParser = require('body-parser');
var socket = require('./helpers/queue-socket');
var colors = require('colors');
colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  info: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  success: 'green',
  help: 'cyan',
  data: 'yellow',
  debug: 'blue',
  error: 'red'
});
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
    if (err) {
      console.log('Connecting to mongo'.info +':' + 'Fail'.error)
      throw err;
    }
    console.log('Connecting to mongo'.info +':' + 'Success'.success)
});

var server = app.listen(3000, function() {
    console.log("Server on:".info + "Success".success + ": port 3000".data);
});
socket.createConnection(server);
var io = socket.getConnection();
var mpd = require('./helpers/mpd.js').io;
mpd(io)
io.on('connection', function(socket) {
    console.log("Socker Connection: ".info + "Success".success);
})

io.on('log', function(data) {
    console.log('data');
})
routes(app, io)
app.use(express.static('public'));
