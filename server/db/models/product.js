'use strict';
const mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true 
	},
	price: {
		type: Number,
		required: true 
	},
	quantity: {
		type: Number,
		required: true
	},
	categories: [{
			type: mongoose.Schema.Types.ObjectId, 
			ref: 'Category',
			required: true
	}],
	photoUrl: {
		type: String,
		default: true 
	}
});

// TODO add method on that allows to subtract quantity from product on checkout? 

mongoose.model('Product', productSchema);