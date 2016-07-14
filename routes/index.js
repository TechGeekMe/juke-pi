var multer = require('../helpers/multer-storage.js')
var upload = multer()
var client = require('../helpers/mpd.js').client
var cmd = require('../helpers/mpd.js').cmd
module.exports = function(app) {
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
    app.post('/upload-file', upload.single('myFile'), function(req, res) {
        console.log("file: " + req.file.path)
        console.log("name: " + req.file.originalname)
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
}
