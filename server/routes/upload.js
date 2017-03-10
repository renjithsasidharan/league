var express = require('express');
var router = express.Router();
var setCurrentUser = require('../middleware/context-currentUser')();
var ensureLoggedIn = require('../middleware/context-ensureLoggedIn')();

/* GET home page. */
router.get('/', setCurrentUser, ensureLoggedIn, function(req, res, next) {
  res.render('upload');
});

module.exports = router;