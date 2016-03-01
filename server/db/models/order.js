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

mongoose.model('Order', orderSchema);