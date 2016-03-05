const router = require('express').Router();
const mongoose = require('mongoose');
const Order = mongoose.model('Order');
const Product = mongoose.model('Product');
module.exports = router;

// req.query has a product id on it
// req.query.product 
router.get('/', function(req, res, next) {
	// productId has to be a object id for the query to work
	let productId = new mongoose.Types.ObjectId(req.query.productId);

	// the hash with other products also ordered together with the queried product
	// connectedProducts: {
	// 	product1: {3}, how often product1 has been in the same order as the queried product
	// 	product3: {7},
	// 	...
	// }
	let connectedProducts = {};

	// Get all the orders that contain productId
	// correct mongo db query:
	// db.orders.find({ purchasedItems: { $elemMatch: { "product._id":ObjectId("56d9c562bbc8920425ea0d47")}}})
	Order.find({ purchasedItems: { $elemMatch: { "product._id": productId}}})
		.then(function(orders) {
			orders.forEach(function(order) {
				order.purchasedItems.forEach(function(item) {
					//item is an object with product&quantity
					if (!item.product._id.equals(productId)) {
						if(!connectedProducts[item.product._id]) connectedProducts[item.product._id] = 1;
						else {
							connectedProducts[item.product._id] += 1;
						}
					}
				})
			})
			// console.log(connectedProducts);

			// find the 3 products that have been order most often together with the queried product
			let recommendedProducts = Object.keys(connectedProducts).sort(function(a, b) {
			    return connectedProducts[b] - connectedProducts[a];
			}).slice(0, 3);
			res.json(recommendedProducts);
		})
		.then(null, next);
});