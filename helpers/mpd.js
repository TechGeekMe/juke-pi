var Song = require('../models/song.js')
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
function playerCallback() {
    client.removeListener('system-player', playerCallback);
    client.sendCommand(cmd("status", []), function(err, msg) {
        if (err) throw err;
        var msgPairs = mpd.parseKeyValueMessage(msg)
        console.log(JSON.stringify(msgPairs))
        if (msgPairs.state == 'stop') {
            // client.sendCommand(cmd("add", [doc.file_path]), function(err, msg) {
            //     if (err) {
            //         throw(err)
            //     }
            //     console.log("New song added to MPD");
            //     Song.songCompleted(doc._id, function(err, doc) {
            //         console.log("Song started" + doc)
            //         // client.sendCommand(cmd("play", []), function(err, msg) {
            //         // })
            //     })
            // })
        } else if (msgPairs.elapsed.startsWith('0.0') && msgPairs.state == 'pause') {
            Song.nextSong(function(err, doc) {
                if (err) {
                    throw(err)
                }
                console.log(JSON.stringify(doc));
                console.log('FILE!!!:' + doc.file_path)
                // client.sendCommand(cmd("add", [doc.file_path]), function(err, msg) {
                //     if (err) {
                //         throw(err)
                //     }
                //     console.log("New song added to MPD");
                //     Song.songCompleted(doc._id, function(err, doc) {
                //         console.log("Song started" + doc)
                //         // client.sendCommand(cmd("play", []), function(err, msg) {
                //         // })
                //     })
                // })
            })
        }
        client.on('system-player', playerCallback);
    });
}
client.on('system-player', playerCallback);
module.exports = client
