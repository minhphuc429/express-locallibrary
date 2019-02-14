var express = require('express');
var router = express.Router();

// Require controller modules.
var searchController = require('../controllers/searchController');

/// BOOK ROUTES ///

// 
// router.post('/register', searchController.register);
router.get('/search', searchController.searchBook);

module.exports = router;