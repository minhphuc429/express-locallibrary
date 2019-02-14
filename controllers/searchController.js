'user strict';

const paginate = require('express-paginate');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var async = require('async');
var Book = require('../models/book');

exports.searchBook = async function (req, res, next) {
    var title = req.query.q;
    try {
        const [results, itemCount] = await Promise.all([
            Book.find({ $text: { $search: title } }).limit(req.query.limit).skip(req.skip).lean().exec(),
            Book.count({})
        ])
    
        const pageCount = Math.ceil(itemCount / req.query.limit);
    
        res.render('books_search', {
            // title: 'Book List',
            books: results,
            pageCount,
            itemCount,
            pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)
        });
    } catch (error) {
        next(error);
    }

    // Book.find({ $text: { $search: title } }, function (err, books) {
    //     if (err) {
    //         return res.render('books_search', { books: null });
    //     }
    //     res.render('books_search', { books: books, q: title });
    // });
}