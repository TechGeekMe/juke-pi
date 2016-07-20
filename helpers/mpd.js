var Song = require('../models/song.js')
var mpd = require('mpd'),
    cmd = mpd.cmd
var locks = require('locks');
var mutex = locks.createMutex();
var updateMutex = locks.createMutex();
var client = mpd.connect({
    port: 6600,
    host: 'localhost',
});
var done = true;
client.on('ready', function() {
    client.playerCallback();
    console.log("ready");
});
client.on('system', function(name) {
    console.log("update", name);
});
client.on('system-database', function() {
    console.log("database update done");
});
client.on('database-update-complete', function() {
    console.log('Database update complete');
    updateMutex.unlock();
})
client.on('system-update', function() {
    done = !done;
    if (done) {
        client.emit('database-update-complete');
    }
    console.log("database update started / finished");
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
                    updateMutex.lock(function(){
                        client.sendCommand(cmd("update", [doc.file_path]), function(err, msg) {
                            updateMutex.lock(function() {
                                client.sendCommand(cmd("add", [doc.file_path]), function(err, msg) {
                                    updateMutex.unlock();
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
