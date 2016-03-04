const router = require('express').Router();
const mongoose = require('mongoose');
const Order = mongoose.model('Order');
const Product = mongoose.model('Product');
module.exports = router;

// req.query has a product id on it
// req.query.product 
router.get('/', function(req, res, next) {
	// look through all orders
	let productId = req.query.productId;

	// the hash with other products also ordered
	let connectedProducts = {};

	console.log("i am in the recommendation route", req.query.productId);

	// purchasedItems: {
	// 	[ {
	// 		product: id,
	// 		quantity: num
	// 	},
	// 	{

	// 	}
	// 	]
	// }
	let id = new mongoose.Types.ObjectId(productId);
	console.log(id)
	// Go through all the orders that contain productId
	// correct mongo db query:
	// db.orders.find({ purchasedItems: { $elemMatch: { "product._id":ObjectId("56d9c562bbc8920425ea0d47")}}})
	Order.find({ purchasedItems: { $elemMatch: { "product._id": id}}})
		.then(function(orders) {
			console.log("i am in the orders promise");
			console.log("purchased items", orders[0].purchasedItems, orders[1].purchasedItems)
			res.json(orders);

			// orders.forEach(function(order) {
			// 	order.purchsedItems.forEach(function(item) {
			// 		//item is an object with product&quantity

			// 	})
			// })
			// find most common other products
			// let recommendedProducts = max(connectedProducts)

			// response has 3 (populated) products
			// [product1, product2, product3]
			// res.json(recommendedProducts)
		})
		.then(null, next);



});