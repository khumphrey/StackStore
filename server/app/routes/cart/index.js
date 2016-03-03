'use strict';

const router = require('express').Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Promise = require('bluebird');


router.get('/', function (req, res, next) {
	if(req.user) {
		User.findById(req.user._id)
		.populate('cart.product')
		.then(function (user) {
			res.status(200).json(user.cart);
		})
	}
	else {
		//THIS DOESNT WORKAHDGFIHASDFUHOASDFOHa!!!!!!??????
		if(!req.session.cart) req.session.cart = []; //initialize a session cart if needed
		console.log("IM CURRENTLY HERE");
		Promise.all(req.session.cart, function (item) {
			console.log("IM NOW INSIDE HERE")
			return findById(item.product)
				.then(function (p) {
					return item.product = p;
				});
		})
		.then(function (array){
			res.status(200).json(array);
		})
	}
});

//req.body.item = {product:"PRODUCTID", quantity: NUMBER}
router.post('/', function (req, res, next) {
		if(req.user) {
			req.user.addOrModify(req.body.item);
			req.user.save()
			.then(function() {
				res.status(201).json(req.user.cart);			
			})
		}
		else {
			//can be optimized later
			var notAdded = true;
			if(!req.session.cart) req.session.cart = [req.body.item]; //initialize a session cart if needed
			else{
				for(var i=0; i<req.session.cart.length; i++) {
					if(req.session.cart[i].product === req.body.item.product) {
						req.session.cart[i].quantity += req.body.item.quantity;
						notAdded = false;
						break;
					} 
				}
				if(notAdded ) req.session.cart.push(req.body.item);
			}
			res.status(201).json(req.session.cart);
		};
});

//req.body.index = index of item in cart(starting at 0)
//req.body.quantity = updated quantity amount
router.put('/', function (req, res, next) {
		if(req.user) {
			req.user.cart[req.body.index].quantity = req.body.quantity;
			req.user.save().then(function(){
				res.status(200).json(req.user.cart);
			})
		}
		else {
			req.session.cart[req.body.index].quantity = req.body.quantity;
			res.status(200).json(req.session.cart);
		};
});


//req.body.index = index of item in cart(starting at 0)
router.delete('/', function (req, res, next) {
	if(req.user) {
			req.user.cart.splice(req.body.index, 1);
			req.user.save().then(function(){
				res.sendStatus(204);
			});
	}
	else {
		if(!req.session.cart) {
		    	next({status:404, message:"Cart does not exist"});
		}
		else{
			req.session.cart.splice(req.body.index, 1);
			res.sendStatus(204);
		};
	};
});

module.exports = router;
