var upload = require('../helpers/multer-storage.js');
var client = require('../helpers/mpd.js')
var mpd = require('mpd')
var cmd = mpd.cmd
var mpdUpdateSync = require('../helpers/mpdupdatesync.js')
var fs = require('fs');
var mm = require('musicmetadata');
var Song = require('../models/song.js');
module.exports = function(app) {
    app.post('/upload-file', upload.single('myFile'), function(req, res, next) {
        if (!req.file) {
            return next('no file uploaded')
        }
        console.log("file: " + req.file.path)
        console.log("name: " + req.file.originalname)
        var filePath = req.file.path
        var updateCommand = cmd("update", [filePath]);
        console.log(updateCommand)
        mpdUpdateSync(filePath, function(err, msg) {
            if (err) next(err);
            var parser = mm(fs.createReadStream(filePath), function (err, metadata) {
                if (err) {
                    return next(err);
                }
                console.log(metadata);
                var song = {
                    file_path: filePath,
                    name: metadata.title,
                    artist: metadata.artist.join(', ')
                }
                Song.insertSong(song, function(err, doc) {
                    if (err) return next(err)
                    res.end('song inserted');
                    client.playerCallback();
                });
            });
        })
    })
}
