'use strict';

const router = require('express').Router();
const mongoose = require('mongoose');
const Order = mongoose.model('Order');
const Product = mongoose.model('Product');

const _ = require('lodash');
const Auth = require('../../../utils/auth.middleware');


router.param('orderId', function(req, res, next, orderId) {
    Order.findById(orderId)
        .populate('user')
        .then(function(order) {
            if (!order) {
                var err = new Error("Order does not exist");
                err.status = 404;
                return next(err);
            }
            req.requestedOrder = order;
            req.requestedUser = order.user;
            next();
        })
        .then(null, function() {
            var err = new Error("Order does not exist");
            err.status = 400;
            next(err);
        });
});

router.get('/', Auth.ensureAuthenticated, function(req, res, next) {
    //if it is a person trying to get their orders that is okay; otherwise needs to be admin
    if (req.query.user !== req.user._id.toString()) {
        if (!Auth.isAdmin(req)) {
            var err = new Error("Not authorized");
            err.status = 403;
            return next(err);
        }
    }

    Order.find(req.query)
        .populate('user')
        .then(function(allOrders) {
            allOrders.forEach(function(order) {
                if (order.user) order.user = order.user.sanitize();
            });
            res.json(allOrders);
        })
        .then(null, next);
});

router.get('/:orderId', Auth.ensureAuthenticated, function(req, res, next) {
    //ensure admin or user (not all orders have users so this is difficult)
    var err;
    if (!Auth.isAdmin(req)) {
        if (req.requestedOrder.user) {
            req.requestedUser = req.requestedOrder.user;
            if (!Auth.isSelf(req)) {
                err = new Error("Users can only view his/her own orders");
                err.status = 403;
                return next(err);
            }
        } else {
            err = new Error("Users can only view his/her own orders");
            err.status = 403;
            return next(err);
        }
    }
    if (req.requestedOrder.user) req.requestedOrder.user = req.requestedOrder.user.sanitize();
    res.json(req.requestedOrder);
});


router.put('/:orderId', Auth.ensureAuthenticated, function(req, res, next) {
    delete req.body.purchasedItems;
    var err;
    //user only change status to Cancelled
    //currently admin and user can change shipping address/email
    if (!Auth.isAdmin(req)) {
        if (req.requestedOrder.user) {
            req.requestedUser = req.requestedOrder.user;
            if (Auth.isSelf(req)) {
                if (req.body.orderStatus !== "Cancelled") {
                    err = new Error("User can only change order status to cancelled");
                    err.status = 400;
                    return next(err);
                }
            } else {
                err = new Error("Users can only view his/her own orders");
                err.status = 403;
                return next(err);
            }
        } else {
            err = new Error("Users can only view his/her own orders");
            err.status = 403;
            return next(err);
        }
    }

    _.extend(req.requestedOrder, req.body);
    req.requestedOrder.save()
        .then(function(order) {
            order.user = order.user.sanitize();
            res.json(order);
        })
        .then(null, next);

});

router.post('/', function(req, res, next) {
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
        }) //a Promise.map would work here right??
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