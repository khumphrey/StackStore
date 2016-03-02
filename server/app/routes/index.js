'use strict';
var router = require('express').Router();
module.exports = router;

router.use('/checkout', require('./checkout'));
router.use('/cart', require('./cart'));
router.use('/users', require('./users'));
router.use('/reviews', require('./reviews'));
router.use('/products', require('./products'));
router.use('/categories', require('./categories'));


// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});
