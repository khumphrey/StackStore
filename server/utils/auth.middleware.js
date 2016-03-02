var Auth = {};

Auth.isAdmin = function (req) {
    return req.user.admin === true;
};

Auth.isSelf = function (req) {
	// this only works if there is a requestedUser property
    return req.user.equals(req.requestedUser);
};

Auth.ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) return next();
	return next({status: 401, message:"not authorized"});
};

Auth.ensureAdminOrSelf = function (req, res, next) {
	if (!req.isAuthenticated()) return next({status: 401, message:"not logged in"});
    if (Auth.isAdmin(req) || Auth.isSelf(req)) return next();
    return next({status: 403, message:"not authorized"});
};

Auth.ensureAdmin = function (req, res, next) {
	if (!req.isAuthenticated()) return next({status: 401, message:"not logged in"});
    if (Auth.isAdmin(req)) return next();
    return next({status: 403, message:"not authorized"});
};

module.exports = Auth;