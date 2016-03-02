'use strict';
const router = require('express').Router();
const _ = require('lodash');
const Product = require('mongoose').model('Product');
const Auth = require('../../../utils/auth.middleware');
module.exports = router;

router.param('prodId', function(req, res, next, prodId) {
	var id = prodId.toString();
	Product.findById(id)
	.populate('categories')
	.then(function (product){
		if(!product) throw Error; 
		req.requestedProduct = product;
		next();
	})
	.then(null, next);
});

router.get('/', function(req, res, next){
	Product.find({})
	.then(products => res.json(products))
	.then(null, next);
	// return .data?
});

router.get('/:prodId', function(req, res){
	res.json(req.requestedProduct);
});

// These will be admin functions:
// router.use(Auth.ensureAuthenticated);
// router.use(Auth.ensureAdmin);

router.post('/', function(req, res, next){
	Product.create(req.body)
	.then(product => res.status(201).json(product))
	.then(null,next);
});

router.put('/:prodId', function(req, res, next){
	_.extend(req.requestedProduct, req.body);
	req.requestedProduct.save()
	.then(product => res.json(product))
	.then(null, next);
});

router.delete('/:prodId', function(req, res, next){
	req.requestedProduct.remove()
	.then(function(){
		res.status(204).end();
	}).then(null, next);
});