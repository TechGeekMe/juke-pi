var Song = require('../models/song.js')
var mpd = require('mpd'),
    cmd = mpd.cmd
var locks = require('locks');
var mutex = locks.createMutex();
var client = mpd.connect({
    port: 6600,
    host: 'localhost',
});
client.on('ready', function() {
    console.log("ready");
    client.playerCallback();
});
client.on('system', function(name) {
    console.log("update", name);
});
client.on('system-database', function() {
    console.log("database update done", name);
});
client.on('system-update', function() {
    console.log("database update started / finished", name);
});
client.playerCallback = function() {
    mutex.lock(function() {
        client.sendCommand(cmd("status", []), function(err, msg) {
            if (err) throw err;
            var msgPairs = mpd.parseKeyValueMessage(msg)
            console.log(JSON.stringify(msgPairs))
            if (msgPairs.state == 'stop' || msgPairs.elapsed.startsWith('0.0') && msgPairs.state == 'pause' && msgPairs.playlistlenght == 0) {
                Song.nextSong(function(err, doc) {
                    if (err) {
                        mutex.unlock();
                        throw(err)
                    } else if (doc == null) {
                        mutex.unlock();
                        console.log("No songs in DB");
                        return;
                    }
                    console.log(JSON.stringify(doc));
                    console.log('FILE!!!:' + doc.file_path)
                    client.sendCommand(cmd("add", [doc.file_path]), function(err, msg) {
                        if (err) {
                            mutex.unlock();
                            throw(err)
                        }
                        console.log("New song added to MPD");
                        Song.songCompleted(doc._id, function(err, doc) {
                            console.log("Song started" + doc)
                            client.sendCommand(cmd("play", []), function(err, msg) {
                                mutex.unlock();
                            })
                        })
                    })
                })
            } else {
                mutex.unlock();
            }
        });
    })
}
client.on('system-player', client.playerCallback);
module.exports = client
