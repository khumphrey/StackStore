'use strict';
const router = require('express').Router();
module.exports = router;
const _ = require('lodash');
const mongoose = require('mongoose');
const Category = mongoose.model('Category');
const Auth = require('../../../utils/auth.middleware');

router.param('categoryId', function (req, res, next, categoryId) {
    Category.findById(categoryId)
    .then(function (category) {
        if (!category) {
            var err = new Error("Category does not exist");
            err.status = 404;
            return next(err);
        }
        req.requestedCategory = category;
        next();
    })
    .then(null, function() {
        var err = new Error("Category does not exist");
        err.status = 404;
        next(err);
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
        .then(category => res.json(category))
        .then(null, next);
});

router.post('/', Auth.ensureAdmin, function (req, res, next) {
    if (!req.body.name) {
        var err = new Error("Name was not give for the category");
        err.status = 400;
        return next(err);
    }
    Category.create(req.body)
        .then(createdCategory => res.status(201).json(createdCategory))
        .then(null, next);
});

router.delete('/:categoryId', Auth.ensureAdmin, function (req, res, next) {
    req.requestedCategory.remove() 
        .then(function(){
            res.status(204).end();
        }).then(null, next);
});

module.exports = router;
