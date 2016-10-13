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

var checkAuthAjax = function(req, res, next) {
    if (!req.session.currentUser)
    {
        res.send({
            status: 403,
            text: 'User not authorized'
        });
    }
    else
    {
        next();
    }
};

var checkAuth = function(req, res, next) {
    if (!req.session.currentUser) 
    {
        res.sendFile(path.join(__dirname, 'login.html'));
    }
    else 
    {
        next();
    }
};

/* Application Home */
app.get('/', checkAuth, function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/register', function(req, res) {

    res.sendFile(path.join(__dirname, 'register.html'));
});

app.post('/register', function(req, res) {

    var user = {
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password,
        person: {
            firstName: req.body.firstName,
            middleName: req.body.middleName,
            lastName: req.body.lastName,
            nickName: req.body.nickName
        }
    };

    dao.createUser(user, function(err) {

        if (err)
        {
            console.error(err);
            res.status(500).sendFile(path.join(__dirname, '500.html'));
        }
        else
        {
            res.redirect('/');
        }
    });
});

app.post('/currentUser', checkAuthAjax, function(req, res) {
    res.send(req.session.currentUser);
});

app.post('/changePassword', checkAuthAjax, function(req, res) {

    dao.updatePassword(req.body.userName, req.body.oldPassword, req.body.newPassword, function(err) {
        
        if (err)
        {
            res.status(500).send({
                status: 500,
                text: err
            });
        }
        else
        {
            res.send({
                status: 200
            });
        }
    });
});

app.post('/login', function(req, res) {

    dao.authenticateUser(req.body.userName, req.body.password, function(err, user) {

        if (err)
        {
            console.error(err);
            res.status(500).sendFile(path.join(__dirname, '500.html'));
        }
        else
        {
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