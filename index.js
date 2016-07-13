var express = require('express')
var app = express();

var mpd = require('mpd'),
    cmd = mpd.cmd
var client = mpd.connect({
  port: 6600,
  host: 'localhost',
});
client.on('ready', function() {
  console.log("ready");
});
client.on('system', function(name) {
  console.log("update", name);
});
client.on('system-player', function() {
  client.sendCommand(cmd("status", []), function(err, msg) {
    if (err) throw err;
    console.log(msg);
  });
});

app.get('/play', function(req, res) {
  client.sendCommand(cmd("play", []), function(err, msg) {
    if (err) throw err;
    console.log(msg);
    res.send('playing');
  });
})

app.get('/pause', function(req, res) {
  client.sendCommand(cmd("pause", []), function(err, msg) {
    if (err) throw err;
    console.log(msg);
    res.send('paused');
  });
})

app.use(express.static('public'));

app.listen(3000);
