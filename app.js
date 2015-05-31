var express      = require('express');
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var fs           = require('fs');
var mongoose     = require('mongoose');
var passport     = require('passport');

var app = express();

// models
mongoose.connect('mongodb://localhost/news');
fs.readdirSync('./models').forEach(function (file) {
  if(file.substr(-3) == '.js') {
      require('./models/' + file);
  }
});
require('./config/passport');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// controllers
var apiRouter = express.Router()
fs.readdirSync('./controllers').forEach(function (file) {
  if(file.substr(-3) == '.js') {
      route = require('./controllers/' + file);
      route.controller(apiRouter);
  }
});
app.use('/api/', apiRouter);

var defaultRouter = express.Router()
defaultRouter.get('*', function(req, res, next) {
  res.sendfile(path.join(__dirname, 'public', 'index.html'))
});
app.use('/', defaultRouter);

app.use(passport.initialize());

// development error handler
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

module.exports = app;
