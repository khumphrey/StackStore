'use strict';

const router = require('express').Router();
const mongoose = require('mongoose');
const Order = mongoose.model('Order');
const User = mongoose.model('User');
const Product = mongoose.model('Product');

const _ = require('lodash');
const Auth = require('../../../utils/auth.middleware');


router.param('orderId', function (req, res, next, orderId) {
    var id = orderId.toString();
    Order.findById(id)
	.populate('user')
    .then(function (order) {
        if (!order) return next({status: 404, message:"Order does not exist"});
        req.requestedOrder = order;
        req.requestedUser = order.user;
        next();
    })
    .then(null, function() {
        next({status: 404, message:"Order does not exist"});
    });
});

router.get('/', Auth.ensureAuthenticated, function (req, res, next) {
	//if it is a person trying to get their orders that is okay; otherwise needs to be admin
	if (req.query.user !== req.user._id.toString()) {
		if (!Auth.isAdmin (req)) return next({status: 403, message:"not authorized"});
	}

	Order.find(req.query)
		.populate('user')
		.then(function (allOrders) {
			allOrders.forEach(function (order) {
				if (order.user) order.user = order.user.sanitize();
			});
			res.json(allOrders);
		})
		.then(null, next);
});

router.get('/:orderId', Auth.ensureAuthenticated, function (req, res, next) {
	//ensure admin or user (not all orders have users so this is difficult)
	if (!Auth.isAdmin(req)) {
		if (req.requestedOrder.user) {
			req.requestedUser = req.requestedOrder.user;
			if (!Auth.isSelf(req)) return next({status: 403, message:"Users can only view his/her own orders"});
		} else return next({status: 403, message:"Users can only view his/her own orders"});	
	}
	if (req.requestedOrder.user) req.requestedOrder.user = req.requestedOrder.user.sanitize();
	res.json(req.requestedOrder);
});


router.put('/:orderId', Auth.ensureAuthenticated, function (req, res, next) {
	delete req.body.purchasedItems;

	//user only change status to Cancelled
	//currently admin and user can change shipping address/email
	if (!Auth.isAdmin(req)) {
		if (req.requestedOrder.user) {
			req.requestedUser = req.requestedOrder.user;
			if (Auth.isSelf(req)) {
				if (req.body.orderStatus !== "Cancelled") return next({status: 400, message:"User can only change order status to cancelled"});
			} else return next({status: 403, message:"Users can only change his/her own orders"});
		} else return next({status: 403, message:"Users can only change his/her own orders"});	
	}

	_.extend(req.requestedOrder, req.body);
	req.requestedOrder.save()
		.then(function (order) {
			order.user = order.user.sanitize();
			res.json(order);
		})
		.then(null, next);
 
});

router.post('/', function (req, res, next) {
	// Order Creation:
	//
	// What we get from the frontEnd:
	// req.body: {
	// 	purchasedItems: cart,
	// 	shippingAddress: xx,
	// 	shippingEmail: xx,
	//  user: only if logged in else it's undefined!
	// }
	// Total price calcualtion and validation is handled in
	// the pre save hook of the order schema

	// This is a public route, so this could get spammed creating orders
	// how do we protect against this? do we need to?

	// we have to populate the cart again
	// cart is 
	var productPromises = [];
	req.body.purchasedItems = req.body.purchasedItems || [];
	req.body.purchasedItems.forEach(function(item) {
		productPromises.push(Product.findById(item.product._id));
	})
	Promise.all(productPromises)
		.then(function(products) {
			products.forEach(function(product, i) {
				req.body.purchasedItems[i].product = product;
			})
			return Order.create(req.body);
		})
		.then(function(createdOrder) {
			// order creation was successful: reset the cart
			if (req.user) {
				req.user.cart = [];
				req.user.save();
			}
			req.session.cart = [];
			res.status(201).json(createdOrder);
		})
		.then(null, function(err) {
			err.status = 400;
			next(err);
		});
});

module.exports = router;
