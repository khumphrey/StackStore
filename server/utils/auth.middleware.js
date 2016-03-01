var Auth = {};

Auth.isAdmin = function (req) {
    return req.user.admin === true;
};

Auth.isSelf = function (req) {
    return req.user.equals(req.requestedUser);
};

Auth.ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) next();
    res.status(401).end(); 
};

Auth.ensureAdminOrSelf = function (req, res, next) {
    if (Auth.isAdmin(req) || Auth.isSelf(req)) next();
    res.status(401).end();
};

Auth.ensureAdmin = function (req, res, next) {
    if (Auth.isAdmin(req)) next();
    res.status(401).end();
};

module.exports = Auth;