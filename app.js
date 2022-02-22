var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var cors = require('cors');
var passport = require('passport');
var config = require('./config/database');

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var institutionRouter = require('./routes/institution');
var bookRouter = require('./routes/book');

var app = express();

require('./config/passport')(passport);
mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("connected to mongoDB"))
  .catch((err) => console.log(err))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());

// Bodyparser middleware, extended false does not allow nested payloads
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/favicon.ico', (req, res) => res.status(200).end());
app.use(passport.initialize());


// Routes
app.use('/', indexRouter);
app.use('/users', userRouter)
app.use('/institution', institutionRouter)
app.use('/books', bookRouter)


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
  res.render('error', {title: "error"});
});

module.exports = app;
