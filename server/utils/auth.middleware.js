var Auth = {};

var isAdmin = function (req) {
    return req.user.admin === true;
};

var isSelf = function (req) {
    return req.user.equals(req.requestedUser);
};

var ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) next();
    res.status(401).end(); 
};

var ensureAdminOrSelf = function (req, res, next) {
    if (isAdmin(req) || isSelf(req)) next();
    res.status(401).end();
};

var ensureAdmin = function (req, res, next) {
    if (isAdmin(req)) next();
    res.status(401).end();
};

module.exports = Auth;