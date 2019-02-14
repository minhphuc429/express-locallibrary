'user strict';

var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var async = require('async');
var User = require('../models/user');

const secret = 'secret';
const JWT_EXPIRATION_MS = 60000;

exports.logout = (req, res) => {
    res.clearCookie('jwt');
    res.redirect('/auth/login');
}

exports.register_get = function (req, res) {
    // 1. See if there is a token on the request...if not, reject immediately
    //
    const userJWT = req.cookies.jwt
    if (!userJWT) {
        // res.send(401, 'Invalid or missing authorization token')
        res.render('register', { title: 'Register' });
    }

    //2. There's a token; see if it is a valid one and retrieve the payload
    //
    else {
        const userJWTPayload = jwt.verify(userJWT, secret)
        if (!userJWTPayload) {
            //Kill the token since it is invalid
            //
            res.clearCookie('jwt')
            // res.send(401, 'Invalid or missing authorization token')
            res.render('register', { title: 'Register' });
        } else {
            res.redirect('/')
        }
    }    
}

exports.register = [

    // Validate fields.
    body('name', 'Name must not be empty.').isLength({ min: 1 }).trim(),
    body('email', 'Email must not be empty.').isLength({ min: 1 }).trim(),
    body('email', 'Email address not valid').isEmail().normalizeEmail().trim(),
    body('password', 'Password length must be minimum 8 characters').isLength({ min: 8 }).trim(),

    // Sanitize fields (using wildcard).
    sanitizeBody('*').trim().escape(),

    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        var newUser = new User(req.body);

        if (!errors.isEmpty()) {
            newUser.password = req.body.password;
            res.render('register', { title: 'Register', user: newUser, errors: errors.array() });
            return;
        } else {
            newUser.save(function (err, result) {
                if (err) { return next(err); }
                //successful - redirect to new book record.
                res.redirect('/auth/login');
            })
        }
    }
];

exports.login_get = function (req, res) {
    // 1. See if there is a token on the request...if not, reject immediately
    //
    const userJWT = req.cookies.jwt
    if (!userJWT) {
        // res.send(401, 'Invalid or missing authorization token')
        res.render('login', { title: 'Login' })
    }

    //2. There's a token; see if it is a valid one and retrieve the payload
    //
    else {
        const userJWTPayload = jwt.verify(userJWT, secret)
        if (!userJWTPayload) {
            //Kill the token since it is invalid
            //
            res.clearCookie('jwt')
            // res.send(401, 'Invalid or missing authorization token')
            res.render('login', { title: 'Login' })
        } else {
            res.redirect('/')
        }
    }
}

exports.login = function (req, res) {
    User.findOne({ 'email': req.body.email }, function (err, user) {
        if (err) return next(err)
        if (user == null) {
            res.status(404).json({ message: 'User not found' });
        } else if (!user.comparePassword(req.body.password)) {
            res.status(401).json({ message: 'Password incorrect' });
        } else {
            var token = jwt.sign({ email: user.email, name: user.name, _id: user._id }, secret);
            res.cookie('jwt', token, { httpOnly: true, expires: 0 });
            // return res.json({ message: 'Login successful', token: token });
            res.redirect('/')
        }
    })
};

exports.loginRequired = function (req, res, next) {
    if (req.user) {
        next();
    } else {
        return res.status(401).json({ message: 'Unauthorized' })
    }
};

