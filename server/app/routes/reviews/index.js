'use strict'

var Review = require('mongoose').model('Review');
var router = require('express').Router();

router.param('reviewId', function(req, res, next, id) {
	Review.findById(id)
		.then(function(review) {
			req.review = review;
		})
		.then(null, function(err){
			next({status: 404, message: "Review not found"});
		})
		.then(null, next);
});

// Return all reviews
router.get('/', function(req, res, next) {
	Review.find()
		.then(function(reviews) {
			res.status(200).json(reviews);	
		})
		.then(null, next);
});

// Return one specific review by ID
router.get('/:reviewId', function(req, res, next) {
	res.status(200).json(req.review);
});

// router.post()
// TBD

// router.put()
// TBD

// router.delete()
// TBD