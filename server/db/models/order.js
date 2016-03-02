'use strict';
const mongoose = require('mongoose');

var orderSchema = new mongoose.Schema({
	purchasedItems: Array,
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	status: {
		type: String,
		enum: ['Created', 'Processing', 'Completed', 'Cancelled'],
		default: 'Created'
	},
	// if user is authenticated the html form will pre-fill the user data
	// if there is no user, these two properties are required for shipping
	shippingAddress: {
		type: String,
		required: true
	},
	shippingEmail: {
		type: String,
		required: true
	}

});

// Needs method to change status



// needs validation for correct products and quantities
// needs a pre save hook that subtracts the purchased items quantities
// from the inventory quantities in the database
// orderSchema.pre('save', function(next) {
// 	// Check if there are actually items in the car
// 	if (!this.purchasedItems || !this.purchasedItems.length) {
// 		return next(new Error('Need items in cart to create order'));
// 	}

// 	// check if none of the products are out of stock
// 	this.purchasedItems.forEach(function(item) {
// 		if (item.product.quantity < item.quantity) {
// 			return next(new Error('Item is out of stock'));
// 		}
// 	});

// 	// if everything is correct we subtract the items from the inventory
// 	var productPromises = [];
// 	this.purchasedItems[0].product.save();
// 	// this.purchasedItems.forEach(function(item) {
// 	// 	var product = item.product;
// 	// 	product.quantity -= item.quantity;
// 	// 	productPromises.push(product.save());
// 	// });

// 	// continue after resolving the save operations on all the products
// 	Promise.all(productPromises)
// 	.then(function(products) {
// 		next();
// 	})
// 	.then(null, function(err) {
// 		next(new Error(err));
// 	});
// });


mongoose.model('Order', orderSchema);