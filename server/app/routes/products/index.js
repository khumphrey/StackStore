'use strict';
const router = require('express').Router();
const Product = require('mongoose').model('Product');
const Auth = require('../../../utils/auth.middleware');
module.exports = router;

router.param('prodId', function(req, res, next, prodId) {
    Product.findById(prodId)
        .populate('categories')
        .then(function(product) {
            if (!product) {
                var err = new Error("Product does not exist");
                err.status = 404;
                return next(err);
            }
            req.requestedProduct = product;
            next();
        })
        .then(null, function() {
            var err = new Error("Product does not exist");
            err.status = 404;
            next(err);
        });
});

router.get('/', function(req, res, next) {
    Product.find({})
        .populate('categories')
        .then(products => res.json(products))
        .then(null, next);
    // return .data?
});

router.get('/:prodId', function(req, res) {
    console.log("Router", req.requestedProduct.categories);
    res.json(req.requestedProduct);
});

// These will be admin functions:
router.use(Auth.ensureAdmin);

router.post('/', function(req, res, next) {
    console.log('post', req.body);
    Product.create(req.body)
        .then(product => res.status(201).json(product))
        .then(null, next);
});

router.put('/:prodId', function(req, res, next) {
    for (var k in req.body) {
        req.requestedProduct[k] = req.body[k];
    }
    req.requestedProduct.save()
        .then(product => res.json(product))
        .then(null, next);
});

router.delete('/:prodId', function(req, res, next) {
    req.requestedProduct.remove()
        .then(function() {
            res.status(204).end();
        }).then(null, next);
});