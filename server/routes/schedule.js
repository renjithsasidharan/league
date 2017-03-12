var express = require('express');
var router = express.Router();
var _ = require('lodash');
var moment = require('moment');

/* GET schedule page. */
router.get('/', function(req, res, next) {
  var app = req.app;
  var fixtureModel = app.models.Fixture;
  fixtureModel.find({
    where: {
      or: [{
        team1Score: null,
        team2Score: null
      }]
    },
    order: 'fixtureDate ASC',
  }, function(err, fixtures) {
    if (err) {
      res.status(500).send('Something is not right!');
      return;
    }
    var groupedFixtures = _.groupBy(fixtures, function(item) {
        var fixtureDate = moment(item.fixtureDate);
        item.fixtureTime = fixtureDate.format('h A');
        return fixtureDate.format('YYYY MM DD');
    });

    res.render('schedule', {
        data: groupedFixtures
    });
  });
});

module.exports = router;
