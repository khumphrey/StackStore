'use strict';
var router = require('express').Router();
module.exports = router;

router.use('/products', require('./products'));
router.use('/users', require('./users'));
router.use('/checkout', require('./checkout'));
router.use('/cart', require('./cart'));

// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});
