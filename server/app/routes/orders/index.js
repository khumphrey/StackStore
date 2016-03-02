'use strict';

const router = require('express').Router();
const mongoose = require('mongoose');
const Order = mongoose.model('Order');
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

router.use(Auth.ensureAuthenticated);

router.get('/', Auth.ensureAdmin, function (req, res, next) {
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

router.get('/:orderId', function (req, res, next) {
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


router.put('/:orderId', function (req, res, next) {
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

	if (req.body.orderStatus) req.requestedOrder.status = req.body.orderStatus;
	_.extend(req.requestedOrder, req.body);
	req.requestedOrder.save()
		.then(function (order) {
			order.user = order.user.sanitize();
			res.json(order);
		})
		.then(null, next);
 
});

// req.body = {cart: cart, shippingAddress: xxxx, shippingEmail: xxx}
// cart: [{ 
//         product: {
//             type: mongoose.Schema.Types.ObjectId, 
//             ref: 'Product'
//         }, 
//         quantity: {type:Number, min:1, default:1}
//     }]
// The cart has to be populated with the products to make sure
// prices etc. stay the same after the order has been created
router.post('/', function (req, res, next) {
	// security consideration:
	// what if someone spams us with orders via postman?
		
	var newOrder = {
		//instead of getting the cart sent from the frontend
		// we could also just use the one on the user or session
		purchasedItems : req.body.cart, 
		shippingAddress : req.body.shippingAddress,
		shippingEmail : req.body.shippingEmail
	};
	// If a guest creates an order there won't be a user property on the order
	if(req.user) newOrder.user = user._id;

	Order.create(newOrder)
	.then(function(createdOrder) {
		res.status(201).send(createdOrder);
	})
	// This should validation errors: Empty carts etc.
	// so the frontend will receive an error
	.then(null, function(err) {
		next({status: 400, message: "Validation Error: Could not create order"});
	});
});

module.exports = router;
