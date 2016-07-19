var express = require('express')
var routes = require('./routes')
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
routes(app)
app.use(express.static('public'));
app.listen(3000, function() {
    console.log("Listening on port 3000");
});
