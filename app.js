const express = require('express');
const app = express();
// const morgan = require('morgan');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');

//import routes
const userRoutes = require('./app/routes/user');
const userRolesRoutes = require('./app/routes/user-role');

//# Dev db for devolopment
mongoose.connect('mongodb+srv://admin:123@cluster0.fbdmn.mongodb.net/Cluster0?retryWrites=true&w=majority', {autoIndex: false});

// app.use(morgan('dev'));
// //app.use(express.bodyparser({uploadDir:'/uploads'}));
// app.use('/uploads', express.static('uploads'));
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

//Handle CROS errors
app.use((req, res, next) =>{
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.all('*', function(req, res, next) {

    if (req.method === 'OPTIONS') {
        console.log('!OPTIONS');
        var headers = {};
        // IE8 does not allow domains to be specified, just the *
        // headers["Access-Control-Allow-Origin"] = req.headers.origin;
        headers["Access-Control-Allow-Origin"] = "*";
        headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
        headers["Access-Control-Allow-Credentials"] = true;
        headers["Access-Control-Allow-Headers"] = "X-Requested-With,content-type,Authorization";
        res.writeHead(200, headers);
        res.end();
    } else {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'PATCH, PUT, GET, POST, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        next();
    }
});

//Routes which should handle requests
app.use('/users', userRoutes);
app.use('/user-roles', userRolesRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found !');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error : {
            message : error.message
        }
    });
});

module.exports = app;

