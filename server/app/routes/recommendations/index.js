const router = require('express').Router();
const mongoose = require('mongoose');
const Order = mongoose.model('Order');
const Product = mongoose.model('Product');
module.exports = router;

// mini cache for top products
// this is initialized with random products
// but the initial values will only be shown if the /similar/ route is hit
// before the /top/ route
// if the /top/ route has been hit at least once it will be filled with appropriate values
var topProducts;
Product.find({})
    .then(function(products) {
        topProducts = products.slice(0,3);
    });

// Helper Function
// find the n products in an object with the highest values
var findTopProducts = function(obj, n) {
    return Object.keys(obj).sort(function(a, b) {
        return obj[b].count - obj[a].count;
    }).slice(0, n).map(key => obj[key].product);
}


// req.query.product : is a productId
router.get('/similar/:productId', function(req, res, next) {
    // productId has to be a object id for the query to work
    let productId = new mongoose.Types.ObjectId(req.params.productId);

    // the hash with other products also ordered together with the queried product
    // connectedProducts: {
    //  product1: { 
    //  count: 3,  how often product1 has been in the same order as the queried product
    //  product: productobj
    // }, 
    //  product3: {7},
    //  ...
    // }
    let connectedProducts = {};

    // Get all the orders that contain productId

    // correct mongo db query:
    // db.orders.find({ purchasedItems: { $elemMatch: { "product._id":ObjectId("56d9c562bbc8920425ea0d47")}}})

    // Optimization ideas:
    // - move more of the logic into the mongo query aggregation pipeline
    // - persist the hash for each product in the database and update only after certain intervals
    // https://gist.github.com/kdelemme/9659364
    Order.find({ purchasedItems: { $elemMatch: { "product._id": productId } } })
        .then(function(orders) {
            orders.forEach(function(order) {
                    order.purchasedItems.forEach(function(item) {
                        //item is an object with product&quantity
                        if (!item.product._id.equals(productId)) {
                            if (!connectedProducts[item.product._id]) {
                                connectedProducts[item.product._id] = {
                                    count: 1,
                                    product: item.product
                                }
                            } else connectedProducts[item.product._id].count += 1;
                        }
                    })
                })
                // find the 3 products that have been order most often together with the queried product
            let recommendedProducts = findTopProducts(connectedProducts, 3);
            console.log(recommendedProducts.length)
            console.log(topProducts.length)

            if (recommendedProducts.length === 3) return res.json(recommendedProducts);
            // it is possible that this does not return 3 products
            // to always return three products to keep the frontend consistent we'll 
            // fill up the array with results from topProducts
            recommendedProducts = recommendedProducts.concat(topProducts.slice(0, 3 - recommendedProducts.length));
            return res.json(recommendedProducts);
        })
        .then(null, next);
});

router.get('/top', function(req, res, next) {

    // return the three most popular products (popular = order most often)
    let productCounts = {};

    Order.find({})
        .then(function(orders) {
            orders.forEach(function(order) {
                order.purchasedItems.forEach(function(item) {
                    if (!productCounts[item.product._id]) {
                        productCounts[item.product._id] = {
                            count: item.quantity,
                            product: item.product
                        }
                    } else productCounts[item.product._id].count += item.quantity;
                })
            })
            let mostPopularProducts = findTopProducts(productCounts, 3);

            topProducts = mostPopularProducts; // save in the cache
            res.json(mostPopularProducts);
        })
        .then(null, next);
})
