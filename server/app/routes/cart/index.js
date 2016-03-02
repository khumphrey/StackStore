'use strict';

const router = require('express').Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');

router.get('/', function (req, res, next) {
	if(req.user) {
		res.status(200).json(req.user.cart);
		// We can populate the products here or make a new request from the return
	}
	else {
		if(!req.session.cart) req.session.cart = []; //initialize a session cart if needed
		res.status(200).json(req.session.cart);
		// We can populate the products here or make a new request from the return
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
			var notAdded = true; //initialize a session cart if needed
			if(!req.session.cart) req.session.cart = [req.body.item];
			else{
				for(var i=0; i<req.session.cart.length; i++) {
					if(req.session.cart[i].product === req.body.item.product) {
						req.session.cart[i].quantity += req.body.item.quantity;
						notAdded = false;
						break;
					} 
				}
				if(notAdded) req.session.cart.push(req.body.item);
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
