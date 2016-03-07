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

router.get('/', Auth.ensureAuthenticated, Auth.ensureAdmin, function (req, res, next) {
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
	// security consideration:
	// what if someone spams us with orders via postman?
	var shippingAddress = req.body.shippingAddress,
		shippingEmail = req.body.shippingEmail;
	
	if (!shippingEmail || !shippingAddress) return next({status: 400, message: "Shipping address and email are required"});

	var newOrder = {
		purchasedItems: req.session.cart,
		shippingAddress : shippingAddress,
		shippingEmail : shippingEmail
	};
	
	//if there is a logged in user, the cart should be on the user schema
	if (req.user) {
		User.findById(req.user._id)
			.populate('cart.product')
			.then(function (user) {
				//if there is no cart, the schema will throw an error
				newOrder.purchasedItems = user.cart;
				newOrder[user] = user._id;
				return Order.create(newOrder);
			})
			.then(order => res.status(201).json(order))
			.then(null, function() {
				next({status: 400, message: "Validation Error: Could not create order"});
			});
	} else {

		//this is in the schema but we still might get an error if there is no req.session.cart 
		//do we want to create a cart on each new session to prevent this?
		if (!req.session.cart) return next({status: 400, message: "There are no items to create an order"});
		
		//populate req.session.cart so it has more than productId
			var productsPromises = [];
			newOrder.purchasedItems.forEach(function (item) {
				productsPromises.push(Product.findById(item.product).exec());
			});

			Promise.all(productsPromises)
				.then(function (products) {
					newOrder.purchasedItems = products;
					return Order.create(newOrder);
				})
				.then(order => res.status(201).json(order))
				.then(null, function() {
					next({status: 400, message: "Validation Error: Could not create order"});
				});

	}

});

module.exports = router;
