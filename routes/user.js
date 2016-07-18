var mpd = require('../helpers/mpd.js')
module.exports = function(app) {
    //TODO Remove in production
    app.get('/command/:command', function(req, res) {
        mpd.client.sendCommand(mpd.cmd(req.params.command, []), function(err, msg) {
            if (err) {
                res.end(JSON.stringify(err))
            } else {
                var msgPairs = mpd.parseKeyValueMessage(msg)
                res.end(JSON.stringify(msgPairs));
            }
        })
    })

    app.get('/status', function(req, res) {
        mpd.client.sendCommand("currentsong", function(err, msg) {
            if (err) throw err;
            var currentSongInfo = mpd.parseKeyValueMessage(msg)
            res.end(JSON.stringify(currentSongInfo));
        })
    })
}
