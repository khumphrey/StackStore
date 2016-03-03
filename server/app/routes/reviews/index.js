'use strict'

var Review = require('mongoose').model('Review');
var router = require('express').Router();
var Auth = require('../../../utils/auth.middleware.js');
var _ = require('lodash');

router.param('reviewId', function (req, res, next, id) {
	Review.findById(id).populate('user')
		.then(function (review) {
			if (!review) {
				return next({status: 404, message: "Review not found"});
			}
			req.review = review;
			review.user = review.user.sanitize();
			// the requestedUser property is used by the Auth middleware utility
			// to check for isSelf
			req.requestedUser = review.user;
			next();
		})
		.then(null, function (err){
			next({status: 404, message: "Review not found"});
		})
		.then(null, next);
});

// Return all reviews, or filtered with a query 
// (to get all reviews of a user or of a product)
router.get('/', function (req, res, next) {
	Review.find(req.query)
		.populate('user product')
		.then(function (reviews) {
			res.json(reviews.map(function (rev) {
				// var scrubberUser = 
				rev.user = {
					_id:rev.user._id,
					username:rev.user.username
				};
				return rev;
				// we only need the user ID and username for products
			}));	
		})
		.then(null, next);
});

// Return one specific review by ID
router.get('/:reviewId', function (req, res, next) {
	res.status(200).json(req.review);
});

router.post('/', Auth.ensureAuthenticated, function (req, res, next) {
	req.body.user = req.user._id; // set Id of reviewer as current logged in user
	Review.create(req.body)
		.then(function (newReview) {
			res.status(201).json(newReview);
		})
		.then(null, next);
});

router.put('/:reviewId', Auth.ensureAdminOrSelf, function (req, res, next) {
	_.extend(req.review, req.body);
	req.review.save()
		.then(function (updatedReview) {
			res.status(200).json(updatedReview);
		})
		.then(null, next);
});

router.delete('/:reviewId', Auth.ensureAdminOrSelf, function (req, res, next) {
	Review.remove(req.review)
		.then(function () {
			res.status(204).send();
		})
		.then(null, next);
});

module.exports = router;