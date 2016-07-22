var mongoose = require('mongoose');

//defining the schema of the DB
var SongSchema = mongoose.Schema({
    file_path: String,
    name: String,
    artist: String,
    votes: {
        type: Number,
        default: 1
    },
    users_voted: [String],
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

SongSchema.statics.insertSong = function(song, callback) {
    var song = new this(song);
    song.save(function(err, doc) {
        if (err) {
            console.log("error inserting song");
            return callback(err, null);
        }
        console.log("New song inserted into DB");
        callback(null, doc);
    });
}
SongSchema.statics.upvoteSong = function(songId, userId, callback) {
    this.findOneAndUpdate({
            _id: songId,
            users_voted: {
                $nin: [userId]
            }
        }, {
            $inc: {
                votes: 1
            },
            $push: {
                users_voted: userId
            }
        }, {
            new: true
        },
        function(err, doc) {
            if (err) {
                console.log("Error Upvoting song in DB");
                return callback(err, null)
            }
            console.log("song upvoted in db");
            return callback(null, doc)
        })

}
SongSchema.statics.songCompleted = function(songId, callback) {
    this.findOneAndUpdate({
        _id: songId
    }, {
        votes: 0,
        users_voted: [],
        updatedAt: Date.now()
    }, function(err, doc) {
        if (err) {
            console.log("Error clearing song in DB");
            console.log(err);
            return callback(err, null)
        }
        console.log("song cleared in db");
        return callback(null, doc)

    });
}

SongSchema.statics.nextSong = function(callback) {
    this.findOne().sort([
        ['votes', -1],
        ['updatedAt', 1]
    ]).exec(callback)
}

SongSchema.statics.fetchQueue = function(callback) {
    this.find({}).sort([
        ['votes', -1],
        ['updatedAt', 1]
    ]).exec(callback)
}
module.exports = mongoose.model('Song', SongSchema);
