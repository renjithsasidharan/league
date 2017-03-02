'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
var exphbs  = require('express-handlebars');

var logger = require("./utils/logger");
var index = require('./routes/index');
var standings = require('./routes/standings');
var result = require('./routes/result');
var schedule = require('./routes/schedule');
var topscorers = require('./routes/top-scorers');
var contact = require('./routes/contact');
var login = require('./routes/login');

//require('./autodiscover');

var app = module.exports = loopback();

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// log all requests
var logRequests = function(req, res, next) {
    logger.info(req.method + " " + req.ip + " " + req.url);
    next();
}

//var router = app.loopback.Router();
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use('/', index);
app.use('/standings', standings);
app.use('/result', result);
app.use('/top-scorers', topscorers);
app.use('/schedule', schedule);
app.use('/contact', contact);
app.use('/login', login);


// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

//  app.use(router);

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
