var multer = require('multer')
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads')
    },
    filename: function(req, file, cb) {
        //console.log("Encoding:" + file.encoding)
        //console.log("MIME:" + file.mimetype)
        filename = file.originalname
        if (file.mimetype === 'audio/mpeg' && !filename.endsWith('.mp3')) {
            filename = filename + '.mp3';
        }
        cb(null, filename)
    }
})
module.exports = multer({
    storage: storage
})
