'use strict';

const router = require('express').Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Product = mongoose.model('Product');
const Promise = require('bluebird');


//Get a user's cart
router.get('/', function(req, res) {
    if (req.user) {
        User.findById(req.user._id)
            .populate('cart.product')
            .then(function(user) {
                res.json(user.cart);
            });
    } else {
        if (!req.session.cart) req.session.cart = []; //initialize a session cart if needed
        Promise.map(req.session.cart, function(item) {
                return Product.findById(item.product);
            })
            .then(function(productArray) {
                res.json(productArray.map(function(product, index) {
                    return { product: product, quantity: req.session.cart[index].quantity }
                }));
            });
    };
});

//Post a new cart
router.post('/', function(req, res) {
    if (req.user && req.session.cart.length > 0) {
        req.session.cart.forEach(function(seshItem) {
            req.user.addOrModify(seshItem);
        });
        req.user.save()
            .then(function() {
                req.session.cart = [];
                res.status(201).json(req.user.cart);
            })
            .then(null, next);
    }
})

//Post a single item to the cart. Expect req.body.quantity = NUMBER
router.post('/:productId', function(req, res, next) {
    var productItem = { product: req.params.productId, quantity: req.body.quantity };
    if (req.user) {
        req.user.addOrModify(productItem);
        req.user.save()
            .then(function() {
                res.status(201).json(req.user.cart);
            })
            .then(null, next);
    } else {
        //can be optimized later
        var notAdded = true;
        if (!req.session.cart) req.session.cart = [productItem]; //initialize a session cart if needed
        else {
            for (var i = 0; i < req.session.cart.length; i++) {
                if (req.session.cart[i].product === productItem.product) {
                    req.session.cart[i].quantity += productItem.quantity;
                    if (req.session.cart[i].quantity <= 0) {
                        req.session.cart.splice(i, 1);
                    }
                    notAdded = false;
                    break;
                }
            }
            if (notAdded && productItem.quantity > 0) req.session.cart.push(productItem);
            else {
                var err = new Error("No negative quantities");
                err.status = 404;
                return next(err);
            }
        }
        res.status(201).json(req.session.cart);
    };
});


//Update all the cart quantities. Expect req.body = [{product:id, quantity:number}]
// router.put('/', function (req, res, next) {
// 	if (req.user) {
// 		req.user.cart =
// 	}
// 	else {
// 		req.session.cart[req.body.index].quantity = req.body.quantity;
// 		res.json(req.session.cart);
// 	};
// });

//Update a single product quantity. Expect req.body.quantity = NUMBER
router.put('/:productId', function(req, res, next) {
    if (req.user) {
        for (var i = 0; i < req.user.cart.length; i++) {
            if (req.user.cart[i].product.equals(req.params.productId)) {
                req.user.cart[i].quantity = req.body.quantity;
                req.user.save()
                break;
            };
        };
        res.json(req.user.cart);
    } else {
        if (!req.session.cart) {
            var err = new Error("Cart does not exist")
            err.status = 404;
            return next(err);
        }
        for (var i = 0; i < req.session.cart.length; i++) {
            if (req.session.cart[i].product === req.params.productId) {
                req.session.cart[i].quantity = req.body.quantity;
                break;
            };
        };
        res.json(req.session.cart);
    };
})

//Delete the whole cart
router.delete('/', function(req, res, next) {
    if (req.user) {
        req.user.cart = [];
        req.user.save()
            .then(function() {
                res.sendStatus(204);
            })
    } else {
        if (!req.session.cart) {
            var err = new Error("Cart does not exist")
            err.status = 404;
            next(err);
        } else {
            req.session.cart = [];
            res.sendStatus(204);
        };
    };
});

//Delete a single item from a cart
router.delete('/:productId', function(req, res, next) {
    if (req.user) {
        for (var i = 0; i < req.user.cart.length; i++) {
            if (req.user.cart[i].product.equals(req.params.productId)) {
                req.user.cart.splice(i, 1);
                req.user.save()
                break;
            };
        };
        res.sendStatus(204);
    } else {
        if (!req.session.cart) {
            var err = new Error("Cart does not exist")
            err.status = 404;
            return next(err);
        } else {
            for (var i = 0; i < req.session.cart.length; i++) {
                if (req.session.cart[i].product === req.params.productId) {
                    req.session.cart.splice(i, 1);
                    break;
                };
            };
        };
        res.sendStatus(204);
    };
});

module.exports = router;