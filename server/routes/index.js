var express = require('express');
var router = express.Router();
var _ = require('lodash');
var moment = require('moment');

/* GET home page. */
router.get('/', function(req, res, next) {
  var app = req.app;
  var fixtureModel = app.models.Fixture;
  fixtureModel.find({
    limit: 4,
    where: {
      or: [{
        team1Score: null,
        team2Score: null
      }]
    },
    order: 'fixtureDate ASC',
  }, function(err, fixtures) {
    if (err) {
      res.render('index');
      return;
    }

    _.forEach(fixtures, function(value, key) {
      var fixtureDate = moment(value.fixtureDate);
      value.displayDate = fixtureDate.format('dddd D MMMM h:mm A');
    });

    fixtureModel.find({
      limit: 4,
      where: {
        and: [{
          team1Score: { neq: null },
          team2Score: { neq: null }
        }]
      },
      order: 'fixtureDate DESC',
    }, function(err, results) {
      if (err) {
        res.render('index', {
          fixtures: fixtures
        });
        return;
      }

      res.render('index', {
        fixtures: fixtures,
        results: results
      });
    });
  });
});

module.exports = router;
