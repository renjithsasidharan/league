var express = require('express');
var router = express.Router();
var _ = require('lodash');
var moment = require('moment');
var helpers = require('handlebars-helpers');
var math = helpers.math();

/* GET standings page. */
router.get('/', function(req, res, next) {
  var app = req.app;
  var fixtureModel = app.models.Fixture;
  fixtureModel.find({
    where: {
      and: [{
        team1Score: { neq: null },
        team2Score: { neq: null },
        team1Points: { neq: null },
        team2Points: { neq: null }
      }]
    }
  }, function(err, fixtures) {
    if (err) {
      res.status(500).send('Something is not right!');
      return;
    }

    var homeFixtures = _.groupBy(fixtures, function(item) {
      return item.team1;
    });
    var awayFixtures = _.groupBy(fixtures, function(item) {
      return item.team2;
    });

    homeTable = [];
    _.forEach(homeFixtures, function(team, key) {
      homeTallyForTeam = {
        team: key,
        won: 0,
        drawn: 0,
        lost: 0,
        gFor: 0,
        gAgainst: 0,
        points: 0
      };
      _.forEach(team, function(match) {
        switch (match.team1Points) {
          case 0:
            homeTallyForTeam.lost++;
            break;
          case 1:
            homeTallyForTeam.drawn++;
            break;
          case 3:
            homeTallyForTeam.won++;
            break;
          default:
        }
        homeTallyForTeam.gFor += match.team1Score;
        homeTallyForTeam.gAgainst += match.team2Score;
        homeTallyForTeam.points += match.team1Points;
      });
      homeTable.push(homeTallyForTeam);
    });

    awayTable = [];
    _.forEach(awayFixtures, function(team, key) {
      awayTallyForTeam = {
        team: key,
        won: 0,
        drawn: 0,
        lost: 0,
        gFor: 0,
        gAgainst: 0,
        points: 0
      };
      _.forEach(team, function(match) {
        switch (match.team2Points) {
          case 0:
            awayTallyForTeam.lost++;
            break;
          case 1:
            awayTallyForTeam.drawn++;
            break;
          case 3:
            awayTallyForTeam.won++;
            break;
          default:
        }
        awayTallyForTeam.gFor += match.team2Score;
        awayTallyForTeam.gAgainst += match.team1Score;
        awayTallyForTeam.points += match.team2Points;
      });
      awayTable.push(awayTallyForTeam);
    });

    pointsTable = [].concat(homeTable);
    _.forEach(awayTable, function(teamTallyAtAway) {
      teamTallyAtHome = _.find(pointsTable, function(o) {
        return teamTallyAtAway.team == o.team;
      });
      if (teamTallyAtHome) {
        var index = _.findIndex(pointsTable, function(o) {
          return o.team == teamTallyAtHome.team;
        });
        pointsTable[index].won = pointsTable[index].won + teamTallyAtAway.won;
        pointsTable[index].drawn = pointsTable[index].drawn + teamTallyAtAway.drawn;
        pointsTable[index].lost = pointsTable[index].lost + teamTallyAtAway.lost;
        pointsTable[index].gFor = pointsTable[index].gFor + teamTallyAtAway.gFor;
        pointsTable[index].gAgainst = pointsTable[index].gAgainst + teamTallyAtAway.gAgainst;
        pointsTable[index].points = pointsTable[index].points + teamTallyAtAway.points;
      } else {
        pointsTable.push(teamTallyAtAway);
      }
    });

    _.forEach(pointsTable, function(value, key) {
        value.gDiff = value.gFor - value.gAgainst;
    })

    var sortedTable = _.orderBy(pointsTable,
      ['points', 'gDiff', 'gFor', 'gAgainst', 'team'], ['desc', 'desc', 'desc', 'asc', 'asc']);
    res.render('standings', {
      data: sortedTable
    });
  });
});

module.exports = router;
