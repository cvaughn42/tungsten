/* Path */
var path = require('path');

/* Web Server */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });

/* DB Interface */
var dao = require('./db');

const port = 8080;

/* Set up resources directory to server static files */
app.use(express.static('resources'));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(session({
    secret: 'currentUser',
    resave: false,
    saveUninitialized: false
}));

var checkAuth = function(req, res, next) {
    if (!req.session.currentUser) 
    {
        res.sendFile(path.join(__dirname + '/login.html'));
    }
    else 
    {
        next();
    }
};

/* Application Home */
app.get('/', checkAuth, function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/login', function(req, res) {

    dao.authenticateUser(req.body.userName, req.body.password, function(err, user) {

        if (err)
        {
            console.error(err);
            res.send(500);
        }
        else
        {
            console.dir(user);
            if (user)
            {
                req.session.currentUser = user;
            }
            else
            {
                // TODO Send invalid credentials

            }            
            
            res.redirect('/');
        }
    });
});

// TODO Make post?
app.get('/logout', function(req, res) {
    delete req.session.currentUser;
    res.redirect('/');
});

var server = app.listen(port, function() {
    console.log('Tungsten listening on port ' + port + '.');
});