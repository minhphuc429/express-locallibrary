var createError = require('http-errors');
var express = require('express');
var paginate = require('express-paginate');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var checkAuthorization = require("./middleware/authentication");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var catalogRouter = require('./routes/catalog');
var authRouter = require('./routes/auth');
var search = require('./routes/search');

//Set up mongoose connection
var mongoose = require('mongoose');
var mongoDB = 'mongodb://localhost:27017/express-locallibrary';
mongoose.connect(mongoDB, { useCreateIndex: true, useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(checkAuthorization);
// keep this before all routes that will use pagination
app.use(paginate.middleware(10, 5));

app.use('/', indexRouter);
app.use('/users', checkAuthorization, usersRouter);
app.use('/catalog', checkAuthorization, catalogRouter);
app.use('/auth', authRouter);
app.use('/', checkAuthorization, search);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
