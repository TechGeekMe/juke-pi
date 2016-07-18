var client = require('../helpers/mpd.js')
var cmd = require('mpd').cmd
module.exports = function(path, cb) {
    client.sendCommand(cmd("update", [path]), function(err, msg) {
        cb(err, msg)
    })
}
