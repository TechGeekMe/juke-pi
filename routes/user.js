var client = require('../helpers/mpd.js')
var cmd = require('mpd').cmd
var Song = require('../models/song.js')
module.exports = function(app) {
    //TODO Remove in production
    app.get('/command/:command', function(req, res) {
        client.sendCommand(cmd(req.params.command, []), function(err, msg) {
            if (err) {
                res.end(JSON.stringify(err))
            } else {
                var msgPairs = mpd.parseKeyValueMessage(msg)
                res.end(JSON.stringify(msgPairs));
            }
        })
    })

    app.get('/status', function(req, res) {
        client.sendCommand("currentsong", function(err, msg) {
            if (err) throw err;
            var currentSongInfo = mpd.parseKeyValueMessage(msg)
            res.end(JSON.stringify(currentSongInfo));
        })
    })
    //TODO Change to post
    app.get('/upvote/:songId/:userId', function(req, res) {
        //TODO Generate User ID through cookie
        Song.upvoteSong(req.params.songId, req.params.userId, function(err, doc) {
            console.log(doc);
            if (doc == null) {
                res.end('already voted')
            }
            res.end(JSON.stringify(doc));
        })
    })
}
