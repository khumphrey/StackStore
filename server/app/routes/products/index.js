'use strict';
const router = require('express').Router();
const Product = require('mongoose').model('Product');
const Auth = require('../../../utils/auth.middleware');
module.exports = router;

router.param('prodId', function(req, res, next, prodId) {
	var id = prodId.toString();
	Product.findById(id)
	// I would rather avoid doing this search altogether when going to individual product views
	.populate('categories')
	.then(function (product){
		if(!product) return next({status: 404, message: "Product not found"}); 
		req.requestedProduct = product;
		next();
	})
	.then(null, function(){ 
		next({status: 404, message: "Product not found"});
	});
});

router.get('/', function(req, res, next){
	Product.find({})
	.populate('categories')
	.then(products => res.json(products))
	.then(null, next);
	// return .data?
});

router.get('/:prodId', function(req, res){
	res.json(req.requestedProduct);
});

// These will be admin functions:
router.use(Auth.ensureAdmin);

router.post('/', function(req, res, next){
	console.log('post',req.body);
	Product.create(req.body)
	.then(product => res.status(201).json(product))
	.then(null,next);
});

router.put('/:prodId', function(req, res, next){
	for (var k in req.body) {
		req.requestedProduct[k] = req.body[k];
	}
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