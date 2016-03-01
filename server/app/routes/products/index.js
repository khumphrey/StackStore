'use strict';
const router = require('express').Router();
const _ = require('lodash');
const Product = require('mongoose').model('Product');
const Auth = require('../../../utils/auth.middleware');
module.exports = router;

router.param('id', function(req, res, next, id) {
	id = id.toString();
	Product.findById(id)
	.then(function (product){
		if(!product) throw Error; 
		req.product = product;
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

router.get('/:id', function(req, res){
	res.json(req.product);
});

//These will be admin functions:
router.post('/', Auth.ensureAdmin, function(req, res, next){
	Product.create(req.body)
	.then(product => res.status(201).json(product))
	.then(null,next);
});

router.put('/:id', Auth.ensureAdmin, function(req, res, next){
	_.extend(req.product, req.body);
	req.product.save()
	.then(products => res.json(products))
	.then(null, next);
});

router.delete('/:id', Auth.ensureAdmin, function(req, res, next){
	req.product.remove()
	.then(function(){
		res.status(204).end();
	}).then(null, next);
});