var Genre = require('../models/genre');
var Book = require('../models/book');
var async = require('async');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display list of all Genre.
exports.genre_list = function (req, res) {
  Genre
    .find()
    .sort([['name', 'ascending']])
    .exec(function (err, list_genres) {
      if (err) return next(err);
      res.render('genre_list', { title: 'Genre List', genre_list: list_genres })
    })
};

// Display detail page for a specific Genre.
exports.genre_detail = async function (req, res, next) {
  Genre.findOne({ slug: req.params.slug }).then(async genre => {
    if (genre == null) { // No results.
      var err = new Error('Genre not found');
      err.status = 404;
      return next(err);
    };

    await Book.find({ 'genre': genre._id }).then(genre_books => {
      res.render('genre_detail', { title: 'Genre Detail', genre: genre, genre_books: genre_books });
    }).catch(err => {
      return next(err);
    })
  }).catch(err => {
    return next(err);
  })
};

// Display Genre create form on GET.
exports.genre_create_get = function (req, res) {
  res.render('genre_form', { title: 'Create Genre' });
};

// Handle Genre create on POST.
exports.genre_create_post = [
  // Validate that the name field is not empty.
  body('name', 'Genre name required').isLength({ min: 1 }).trim(),
  body('slug', 'Slug name required').isLength({ min: 1 }).trim(),

  // Sanitize (trim and escape) the name field.
  sanitizeBody('name').trim().escape(),
  sanitizeBody('slug').trim().escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    var genre = new Genre({
      name: req.body.name,
      slug: req.body.slug
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('genre_form', { title: 'Create Genre', genre: genre, errors: errors.array() });
      return;
    }
    else {
      // Data from form is valid.
      // Check if Genre with same name already exists.
      Genre.findOne({ 'name': req.body.name })
        .exec(function (err, found_genre) {
          if (err) { return next(err); }

          if (found_genre) {
            // Genre exists, redirect to its detail page.
            res.redirect(found_genre.url);
          }
          else {
            genre.save(function (err) {
              if (err) { return next(err); }
              // Genre saved. Redirect to genre detail page.
              res.redirect(genre.url);
            });
          }
        });
    }
  }
];

// Display Genre delete form on GET.
exports.genre_delete_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Genre delete GET');
};

// Handle Genre delete on POST.
exports.genre_delete_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Genre delete POST');
};

// Display Genre update form on GET.
exports.genre_update_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Genre update GET');
};

// Handle Genre update on POST.
exports.genre_update_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Genre update POST');
};