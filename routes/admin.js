var express = require('express')
var client = require('../helpers/mpd.js').client
var cmd = require('mpd').cmd
var admin = express.Router();
admin.get('/play', function(req, res) {
  client.sendCommand(cmd("play", []), function(err, msg) {
      if (err) throw err;
      console.log(msg);
      res.send('playing');
  });
})

admin.get('/pause', function(req, res) {
  client.sendCommand(cmd("pause", []), function(err, msg) {
      if (err) throw err;
      console.log(msg);
      res.send('paused');
  });
})

admin.get('/stop', function(req, res) {
  client.sendCommand(cmd("stop", []), function(err, msg) {
      if (err) throw err;
      console.log(msg);
      res.send('stop');
  });
})

admin.get('/next', function(req, res) {
    client.sendCommand(cmd("next", []), function(err, msg) {
        if (err) throw err;
        console.log(msg);
        res.send('playing next');
    });
});

admin.get('/previous', function(req, res) {
    client.sendCommand(cmd("previous", []), function(err, msg) {
        if (err) throw err;
        console.log(msg);
        res.send('playing previous');
    });
});

admin.get('/setvol/:vol', function(req, res) {
    client.sendCommand(cmd("setvol", [req.params.vol]), function(err, msg) {
        if (err) throw err;
        console.log(msg);
        res.send('volume changed');
    });
});

admin.get('vol', function(req, res) {
    //TODO: Fetch volume to display along a slider
})


module.exports = admin;
