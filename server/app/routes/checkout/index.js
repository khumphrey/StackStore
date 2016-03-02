'use strict';

const router = require('express').Router();
const mongoose = require('mongoose');
const Order = mongoose.model('Order');

router.post('/', function (req, res, next) {
		req.body.status = null;  //security to prevent someone posting with a body.status
		
		var orderObject = {
				purchasedItems: req.session.cart,  //default is the cart of the session, not sure if this is secure
				shippingAddress: req.body.shippingAddress,
				shippingEmail: req.body.shippingEmail
			};

		if(req.user){ //if a user is logged in, create the order with a userId and their card
			orderObject.user = req.user;
			orderObject.purchasedItems = req.user.cart
		}

		if(!orderObject.purchasedItems) {
			res.status(400);
			res.send("Your cart is empty");
		}
		else {
			Order.create(orderObject)
			.then(function (createdOrder) {
				res.status(201);
				res.send(createdOrder._id); //return the order's Id which can be used for the confirmation email
			});
		}
		/*
			Issues:
				* Does not deduct quantities from products
		*/
})

module.exports = router;