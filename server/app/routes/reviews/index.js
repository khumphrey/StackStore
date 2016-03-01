'use strict'

var Review = require('mongoose').model('Review');
var router = require('express').Router();

router.param('reviewId', function(req, res, next, id) {
	Review.findById(id)
		.then(function(review) {
			if (!review) {
				return next({status: 404, message: "Review not found"});
			}
			req.review = review;
			next();
		})
		.then(null, function(err){
			next({status: 404, message: "Review not found"});
		})
		.then(null, next);
});

// Return all reviews
// do we want to populate them?
router.get('/', function(req, res, next) {
	Review.find({})
		.then(function(reviews) {
			res.status(200).json(reviews);	
		})
		.then(null, next);
});

// Return one specific review by ID
// do we want to populate it?
router.get('/:reviewId', function(req, res, next) {
	res.status(200).json(req.review);
});


// AUTHENTICATION --- ALL FOLLOWING ROUTES ARE NOT PUBLIC
var ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
};

router.use(ensureAuthenticated);

router.post('/', function(req, res, next) {
	Review.create(req.body)
		.then(function(newReview) {
			res.status(201).json(newReview);
		})
		.then(null, next);
});

router.put('/:reviewId', function(req, res, next) {
	Review.update(req.review, req.body)
		.then(function() {
			return Review.findById(req.review._id);
		})
		.then(function(updatedReview) {
			res.status(200).json(updatedReview);
		})
		.then(null, next);
});

router.delete('/:reviewId', function(req, res, next) {
	Review.remove(req.review)
		.then(function() {
			res.status(204).send();
		})
		.then(null, next);
});

module.exports = router;