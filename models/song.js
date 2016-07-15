var mongoose = require('mongoose');

//defining the schema of the DB
var SongSchema = mongoose.Schema({
    filename: String,
    name: String,
    artist: String,
    votes: Number,
    users_voted: [String],
});

SongSchema.statics.insertSong = function(song, callback)  {
    var song = new this(song);
    song.save(function(err, doc) {
        if(err) {
            console.log("error inserting song");
            callback(err, doc);
        } else {
            console.log("New song inserted into DB");
            callback(null, doc);
        }
    });
 }
SongSchema.statics.upvoteSong = function(song, userId, callback) {
    var id = song._id;
    song.votes = song.votes+1
    song.users_voted.push(userId)
    var query = {id: id}
    this.update(query, student, function(err, numAffected)  {
        if(err) {
            console.log("Error Upvoting song in DB");
            callback(err, null)
        }else {
            console.log("song upvoted in db");
            callback(null, numAffected)
        }
    });
}
SongSchema.statics.songCompleted = function(song, callback) {
    var id = song._id;
    song.votes = 0
    song.users_voted = []
    var query = {id: id}
    this.update(query, student, function(err, numAffected)  {
        if(err) {
            console.log("Error clearing song in DB");
            callback(err, null)
        }else {
            console.log("song cleared in db");
            callback(null, numAffected)
        }
    });
}
module.exports = mongoose.model('Song', SongSchema);
