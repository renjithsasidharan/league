var loopback = require('loopback');
var server = require('../../server/server');
var async = require('async');
var admin = require('digitopia-admin');

module.exports = function (MyUser) {

	if (process.env.ADMIN) {
		admin.setUpRoleToggleAPI(MyUser);
	}

	// on login set access_token cookie with same ttl as loopback's accessToken
	MyUser.afterRemote('login', function setLoginCookie(context, accessToken, next) {
		var res = context.res;
		var req = context.req;
		if (accessToken != null) {
			if (accessToken.id != null) {
				res.cookie('access_token', accessToken.id, {
					signed: req.signedCookies ? true : false,
					maxAge: 1000 * accessToken.ttl
				});
			}
		}
		return next();
	});

	MyUser.afterRemote('logout', function removeLoginCookie(context, accessToken, next) {
		var res = context.res;
		var req = context.req;
		res.clearCookie('access_token', {
			signed: req.signedCookies ? true : false
		});
		return next();
	});
};
