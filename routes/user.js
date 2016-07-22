var client = require('../helpers/mpd.js')
var mpd = require('mpd')
var cmd = mpd.cmd
var Song = require('../models/song.js')
var async = require('async')

module.exports = function(app) {

    app.get('/song-data', function(req, res) {
        async.parallel([
            function(callback) {
                client.sendCommand("currentsong", function(err, msg) {
                    if (err) return callback(err, null);
                    if (msg == '') {
                        callback(null, 'no song')
                    } else {
                        var currentSongInfo = mpd.parseKeyValueMessage(msg)
                        callback(null, currentSongInfo);
                    }
                })
            },
            function(callback) {
                Song.fetchQueue(function(err, docs) {
                    if (err) return callback(err, null)
                    callback(null, docs)
                })
            }
        ], function(err, results) {
            res.end(JSON.stringify({currentSong: results[0], queue: results[1]}));
        })
    })
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

    app.get('/status', function(req, res, next) {

    })


    app.get('/upvote/:songId', function(req, res) {
        console.log("songID:"+req.params.songId+" ,userID:"+ req.session.id)
        Song.upvoteSong(req.params.songId, req.session.id, function(err, doc) {
            console.log(doc);
            if (doc == null) {
                res.end('already voted')
            }
            res.end(JSON.stringify(doc));
        })

    })
}
