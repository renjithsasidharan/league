var express = require('express');
var router = express.Router();
var _ = require('lodash');
var moment = require('moment');
var helpers = require('handlebars-helpers');
var comparison = helpers.comparison();
var array = helpers.array();

/* GET home page. */
router.get('/', function(req, res, next) {
  var app = req.app;
  var fixtureModel = app.models.Fixture;
  fixtureModel.find({
    where: {
      and: [{
        team1Score: {neq: null},
        team2Score: {neq: null}
      }]
    },
    include: {
      relation: 'Goals',
      scope: {
        fields: ["playerId"],
        include: {
            relation: 'player',
            scope: {
                fields: ["teamName", "name"]
            }
        }
      }
    },
    order: 'fixtureDate DESC',
  }, function(err, fixtures) {
    if (err) {
      res.status(500).send('Something is not right!');
      return;
    }
    fixtures = JSON.parse(JSON.stringify(fixtures));
    _.forEach(fixtures, function(fixture, key) {
        fixture.team1Goals = []; fixture.team2Goals = [];
        _.forEach(fixture.Goals, function(goal, id) {
            goal.player.teamName === fixture.team1 ? fixture.team1Goals.push(goal) : fixture.team2Goals.push(goal);
        });
        console.log(fixture);
    });
    var groupedFixtures = _.groupBy(fixtures, function(item) {
        var fixtureDate = moment(item.fixtureDate);
        item.fixtureTime = fixtureDate.format('h A');
        return fixtureDate.format('YYYY MM DD');
    });

    res.render('result', {
        data: groupedFixtures
    });
  });
});

module.exports = router;
