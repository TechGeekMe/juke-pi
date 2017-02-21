var client = require('../helpers/mpd.js').client
var mpd = require('mpd')
var cmd = mpd.cmd
var Song = require('../models/song.js')
var async = require('async')
var socket = require('../helpers/queue-socket');
module.exports = function(app, io) {
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
                res.end(JSON.stringify({
                    currentSong: results[0],
                    queue: results[1]
                }));
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
    app.get('/upvote/:songId', function(req, res) {
        Song.upvoteSong(req.params.songId, req.session.id, function(err, doc) {
            //console.log(doc);
            if (doc == null) {
                console.log("Song upvote: ".info + "Fail".error + ":already voted".data)
                return res.end('already voted')
            }
            console.log("Song upvote: ".info + "Success".success + ": votes = ".data + (""+doc.votes).data)
            io.emit('upvote', {
                songId: doc._id,
                votes: doc.votes
            })
            res.end(JSON.stringify(doc));
        })
    })
}
