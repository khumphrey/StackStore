'use strict';
const router = require('express').Router();
module.exports = router;
const _ = require('lodash');
const mongoose = require('mongoose');
const Category = mongoose.model('Category');
const Auth = require('../../../utils/auth.middleware');

router.param('categoryId', function (req, res, next, categoryId) {
    var id = categoryId.toString();
    Category.findById(id)
    .then(function (category) {
        if (!category) return next({status: 404, message:"Category does not exist"});
        req.requestedCategory = category;
        next();
    })
    .then(null, function() {
        next({status: 404, message:"Category does not exist"});
    });
});

router.get('/', function (req, res, next) {
    Category.find(search)
    .populate('cart history')
    .then(allCategorys => res.json(allCategorys))
    .then(null, next);
});

//get all Category info for a particular ID
router.get('/:categoryId', Auth.ensureAdminOrSelf, function (req, res) {
    //if the Category is logged, is either admin or the Category it is requesting send back the Category info
    res.json(req.requestedCategory);
});

router.put('/:categoryId', Auth.ensureAdminOrSelf, function (req, res, next) {
    if (Auth.isSelf(req)) delete req.body.admin;
    _.extend(req.requestedCategory, req.body); //should this be _.assignIn?
    req.requestedCategory.save() //because we already pulled this to the server we can just save rather than update
    .then(Category => res.json(Category.sanitize())) //will this have the cart and history populated? Do we need it?
    .then(null, next);
});

router.post('/', Auth.ensureAdmin, function (req, res, next) {
    Category.create(req.body)
    .then(createdCategory => res.status(201).json(createdCategory.sanitize()))
    .then(null, next);
});
