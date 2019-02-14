var express = require('express');
var router = express.Router();

// Require controller modules.
var authController = require('../controllers/authController');

/// BOOK ROUTES ///

// register
router.get('/register', authController.register_get);
router.post('/register', authController.register);

// login
router.get('/login', authController.login_get);
router.post('/login', authController.login);

// logout
router.post('/logout', authController.logout);

module.exports = router;