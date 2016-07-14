var express = require('express')


var multer = require('multer')
var app = express();
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname + '.mp3')
  }
})

var upload = multer({storage: storage})

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
app.post('/upload-file',upload.single('myFile'), function(req, res)  {
  console.log("file: "+req.file.path)
  console.log("name: "+req.file.originalname)
  var filePath = 'uploads/' + req.file.originalname + '.mp3';
  var updateCommand = cmd("update", [filePath]);
  var addCommand = cmd("add", [filePath])
  client.sendCommand(updateCommand, function(err, msg) {
    if (err) throw err;
    client.sendCommand(addCommand, function(err, msg) {
      if (err) throw err;
        res.end();
    })
  })
  // client.sendCommand(cmd("update", [filePath]), function(err, msg) {
  //   if (err) throw err;
  //   client.sendCommand(cmd("add", [filePath]), function(err, msg) {
  //     if (err) throw err;
  //     res.end();
  //   })
  // })
})

app.use(express.static('public'));

app.listen(3000);
