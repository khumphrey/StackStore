'use strict';
const mongoose = require('mongoose');

var orderSchema = new mongoose.Schema({
	purchasedItems: Array,
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	totalPrice: {
		type: Number
	},
	orderStatus: {
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


orderSchema.pre('save', function(next) {
	
	// Check for items in cart
	if (!this.purchasedItems || !this.purchasedItems.length) {
		return next(new Error('Need items in cart to create order'));
	}

	// check if none of the products are out of stock
	this.purchasedItems.forEach(function(item) {
		if (item.product.quantity < item.quantity) {
			return next(new Error('Item is out of stock'));
		}
	});

	// if everything is correct we subtract the items from the inventory for new orders
	var productPromises = [];
	// console.log(this.purchasedItems)

	if (this.isModified('purchasedItems')) {
		this.purchasedItems.forEach(function(item) {
			// console.log(item.product.save)
			// you cant assume that the purchased items are actually products!! Do validations on each product here
			var product = item.product;
			product.quantity -= item.quantity;
			productPromises.push(product.save());
		});

		// Calculate the total price
		this.totalPrice = this.purchasedItems.reduce(function(sum, item) {
		    return item.product.price * item.quantity + sum;
		}, 0)
	}




	// continue after resolving the save operations on all the products
	Promise.all(productPromises)
	.then(function() {
		next();
	})
	.then(null, function(err) {
		next(new Error(err));
	});
});


mongoose.model('Order', orderSchema);