'use strict';
var router = require('express').Router();
var Product  = require('mongoose').model('Product');
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