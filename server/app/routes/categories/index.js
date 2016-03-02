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
    Category.find(req.query)
    .then(allCategories => res.json(allCategories))
    .then(null, next);
});

router.get('/:categoryId', function (req, res) {
    res.json(req.requestedCategory);
});

router.put('/:categoryId', Auth.ensureAdmin, function (req, res, next) {
    _.extend(req.requestedCategory, req.body);
    req.requestedCategory.save() 
        .then(res.json)
        .then(null, next);
});

router.post('/', Auth.ensureAdmin, function (req, res, next) {
    if (!req.body.name) return next({status: 400, message: "Name was not give for the category"})
    Category.create(req.body)
        .then(createdCategory => res.status(201).json(createdCategory))
        .then(null, next);
});

module.exports = router;
