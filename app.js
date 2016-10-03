var express = require('express');
var app = express();

var port = 8080;

app.get('/', function(req, res) {
    res.send('Hello, World!');
});

var server = app.listen(port, function() {
    console.log('Tungsten listening on port ' + port + '.');
});