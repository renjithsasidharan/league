var setCurrentUser = require('../middleware/context-currentUser')();

module.exports = function(app) {
  var User = app.models.MyUser;

  app.get('/login', setCurrentUser, function(req, res, next) {
    var reqContext = req.getCurrentContext();
    if (reqContext.get('currentUser')) {
      res.redirect('/upload');
      return;
    }
    res.render('login');
  });


  app.post('/login', setCurrentUser, function(req, res) {

    User.login({
      email: req.body.email,
      password: req.body.password
    }, 'user', function(err, token) {
      if (err) {
        res.render('login', {
          errorMessage: 'Login failed'
        });
        return;
      }

      res.cookie('access_token', token.id, {
        signed: true,
        maxAge: 1000 * token.ttl
      });
      res.send({ 'redirect': '/upload' });
    });
  });

  //log a user out
  app.get('/logout', function(req, res, next) {
    if (!req.accessToken) return res.sendStatus(401);
    User.logout(req.accessToken.id, function(err) {
      if (err) return next(err);
      res.redirect('/');
    });
  });
}
