var express = require('express');
var router = express.Router();
var _ = require('lodash');
var moment = require('moment');

/* GET home page. */
router.get('/', function(req, res, next) {
  var app = req.app;
  var goalModel = app.models.Goal;
  goalModel.find({
    "include": {
      "relation": "player",
      "scope": {
        "fields": ["teamName", "name"]
      }
    }
  }, function(err, goals) {
    if (err) {
      res.status(500).send('Something is not right!');
      return;
    }
    goalsGroupedByPlayer = _.groupBy(goals, function(goal) {
      return goal.playerId;
    });
    goalCountForPlayers = [];
    //workaround for https://github.com/strongloop/loopback/issues/2205
    _.forEach(JSON.parse(JSON.stringify(goalsGroupedByPlayer)), function(value, key) {
      console.log(value[0]["player"]);
      goalCountForPlayers.push({
        id: key,
        name: value[0].player.name,
        team: value[0].player.teamName,
        goals: value.length
      });
    });

    sortedGoalCount = _.orderBy(goalCountForPlayers, ['goals', 'name'], ['desc', 'asc']);
    res.render('top-scorers', {
      data: sortedGoalCount
    });
  });
});

module.exports = router;
