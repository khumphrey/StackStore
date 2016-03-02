'use strict'

var Review = require('mongoose').model('Review');
var router = require('express').Router();
var Auth = require('../../../utils/auth.middleware.js');

router.param('reviewId', function(req, res, next, id) {
	Review.findById(id).populate('user')
		.then(function(review) {
			if (!review) {
				return next({status: 404, message: "Review not found"});
			}
			req.review = review;
			// the requestedUser property is used by the Auth middleware utility
			// to check for isSelf
			req.requestedUser = review.user;
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


router.post('/',Auth.ensureAuthenticated, function(req, res, next) {
	Review.create(req.body)
		.then(function(newReview) {
			res.status(201).json(newReview);
		})
		.then(null, next);
});

router.put('/:reviewId', Auth.ensureAdminOrSelf, function(req, res, next) {
	Review.update(req.review, req.body)
		.then(function() {
			return Review.findById(req.review._id);
		})
		.then(function(updatedReview) {
			res.status(200).json(updatedReview);
		})
		.then(null, next);
});


router.delete('/:reviewId', Auth.ensureAdminOrSelf, function(req, res, next) {
	Review.remove(req.review)
		.then(function() {
			res.status(204).send();
		})
		.then(null, next);
});

module.exports = router;