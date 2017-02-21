var upload = require('../helpers/multer-storage.js');
var client = require('../helpers/mpd.js').client
var mpd = require('mpd')
var cmd = mpd.cmd
var mpdUpdateSync = require('../helpers/mpdupdatesync.js')
var fs = require('fs');
var mm = require('musicmetadata');
var Song = require('../models/song.js');
var socket = require('../helpers/queue-socket');
module.exports = function(app, io) {
    app.post('/upload-file', upload.single('file'), function(req, res, next) {
        if (!req.file) {
            return next('no file uploaded')
        }
        console.log("File upload: ".info + "Success".success + ":" +"path: ".data + req.file.path.verbose + " name:".data +  req.file.originalname.verbose)
        var filePath = req.file.path
        var parser = mm(fs.createReadStream(filePath), function(err, metadata) {
            if (err) {
                return next(err);
            }
            //console.log(metadata);
            var song = {
                file_path: filePath,
                name: metadata.title,
                artist: metadata.artist.join(', ')
            }
            Song.insertSong(song, function(err, doc) {
                if (err) return next(err)
                res.end('song inserted');
                client.playerCallback();
                io.emit('new-upload', doc)
            });
        });
    })
}
