var client = require('../helpers/mpd.js')
var cmd = require('mpd').cmd
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
}
