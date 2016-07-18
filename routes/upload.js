var upload = require('../helpers/multer-storage.js');
var mpd = require('../helpers/mpd.js')
module.exports = function(app) {
    app.post('/upload-file', upload.single('myFile'), function(req, res) {
        console.log("file: " + req.file.path)
        console.log("name: " + req.file.originalname)
        var filePath = req.file.path
        var updateCommand = mpd.cmd("update", []);
        console.log(updateCommand)
        mpd.client.sendCommand(updateCommand, function(err, msg) {
            if (err) throw err;
            var addCommand = mpd.cmd("add", [filePath]);
            console.log(addCommand)
            mpd.client.sendCommand("status", [], function(err, msg) {
                if (err) throw err;
                var status = mpd.parseKeyValueMessage(msg)
                
                mpd.client.sendCommand(addCommand, function(err, msg) {
                    if (err) throw err;
                    res.end();
                })
                res.end();
            })
        })
    })
}
