'use strict';

const router = require('express').Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
// const Product = mongoose.model('Product');

router.get('/', function (req, res, next) {
	if(req.user) {
		User.findById(req.user._id).exec()
		.then(function (user) {
			console.log("HAY HAY")
			res.status(200).json(user.cart);
		})
	}
	else {
		if(!req.session.cart) req.session.cart = []; //initialize a session cart if needed
		res.status(200);
		res.send(req.session.cart);
	}
});

//req.body.item = {product:"PRODUCTID", quantity: NUMBER}
/*
	Issues:
		* Does not check if product quantity is in stock
		* req.session.cart validation
		* req.session.cart does not have the add-by-posting ability
*/
router.post('/', function (req, res, next) {
		if(req.user) {
			User.findById(req.user._id).exec()
			.then(function (user) {
				user.addOrModify(req.body.item);
			})
			.then(function () {
				res.status(201).end();
			});
		}
		else {
			if(!req.session.cart) {
				req.session.cart = []; //initialize a session cart if needed
			}
			req.session.cart.push(req.body.item);
			res.status(201);
			res.send(req.session.cart);
		};
});

//req.body.index = index of item in cart(starting at 0)
//req.body.quantity = updated quantity amount
/*
	Issues:
		* Does not check if product quantity is in stock
		* req.session.cart validation
*/
router.put('/', function (req, res, next) {
		if(req.user) {
			User.findById(req.user._id).exec()
			.then(function (user) {
				user.cart[req.body.index].quantity = req.body.quantity;
				user.save();
			})
			.then(function () {
				res.status(200);
			});
		}
		else {
			req.session.cart[req.body.index].quantity = req.body.quantity;
			res.status(200).json(req.session.cart);
		};
});


//req.body.index = index of item in cart(starting at 0)
router.delete('/', function (req, res, next) {
	if(req.user) {
		User.findById(req.user._id).exec()
		.then(function (user) {
			user.cart.splice(req.body.index, 1);
			user.save();
		})
		.then(function () {
			res.status(204);
		});
	}
	else {
		if(!req.session.cart) {
			req.session.cart = []; //making sure noone can somehow give a delete request without a cart
			res.status(200);
		}
		else{
			req.session.cart.splice(req.body.index, 1);
			res.status(204);
		};
	};
});

module.exports = router;
