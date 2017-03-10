var admin = require('digitopia-admin');
//var admin = require('../../../../digitopia-admin/index.js');
var getCurrentUser = require('../middleware/context-currentUser');
var ensureAdminUser = require('../middleware/context-ensureAdminUser');

module.exports = function (server) {
	var userAuth = [getCurrentUser(), ensureAdminUser()];
	admin.adminBoot(server, userAuth, 'MyUser', ['Team', 'Player', 'Fixture', 'Goal']);
	return;
	if (process.env.ADMIN) {
		function dashboard(cb) {
			cb(null, 'hi from dashboard');
		}

		var userAuth = [getCurrentUser(), ensureAdminUser()];
		var options = {
			'i18n': true,
			'dashboard': dashboard
		};
		admin.adminBoot(server, userAuth, 'MyUser', ['MyUser', 'Team', 'Fixtures'], options);
	}
};
