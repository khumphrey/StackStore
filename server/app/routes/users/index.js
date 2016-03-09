'use strict';
const router = require('express').Router();
module.exports = router;
const _ = require('lodash');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Auth = require('../../../utils/auth.middleware');

router.param('userId', function(req, res, next, userId) {
    User.findById(userId)
        .populate('cart history')
        .then(function(user) {
            if (!user) {
                var err = new Error("User does not exist");
                err.status = 404;
                return next(err);
            }
            req.requestedUser = user;
            next();
        })
        .then(null, function() {
            var err = new Error("User does not exist");
            err.status = 404;
            next(err);
        });
});

router.use(Auth.ensureAuthenticated);

router.get('/', Auth.ensureAdmin, function(req, res, next) {
    User.find(req.query)
        .populate('cart history')
        .then(function(allUsers) {
            res.json(allUsers.map(function(user) {
                return user.sanitize();
            }));
        })
        .then(null, next);
});

//get all user info for a particular ID
router.get('/:userId', Auth.ensureAdminOrSelf, function(req, res) {
    //if the user is logged, is either admin or the user it is requesting send back the user info
    res.json(req.requestedUser.sanitize());
});

router.put('/:userId', Auth.ensureAdminOrSelf, function(req, res, next) {
    if (Auth.isSelf(req)) delete req.body.admin;
    _.extend(req.requestedUser, req.body); //should this be _.assignIn?
    req.requestedUser.save() //because we already pulled this to the server we can just save rather than update
        .then(user => res.json(user.sanitize())) //will this have the cart and history populated? Do we need it?
        .then(null, next);
});

router.post('/', Auth.ensureAdmin, function(req, res, next) {
    if (!req.body.email || !req.body.password) {
        var err = new Error("Email or password not provided");
        err.status = 400;
        return next(err);
    }
    User.create(req.body)
        .then(createdUser => res.status(201).json(createdUser.sanitize()))
        .then(null, next);
});

router.delete('/:userId', Auth.ensureAdmin, function(req, res, next) {
    req.requestedUser.remove()
        .then(function() {
            res.status(204).end();
        })
        .then(null, next);
});

module.exports = router;