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
	categories: {
		type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Category'}],	
	},
	photoUrl: {
		type: String, //this can either be a local url (public folder) or to a website
		default: true 
	}
});

mongoose.model('Product', productSchema);