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
		default: "http://images0.boattrader.com/resize/1/24/1/5372401_20150903175537814_1_LARGE.jpg?w=480&h=350&t=1212120" 
	}
});

// TODO add method on that allows to subtract quantity from product on checkout? 

mongoose.model('Product', productSchema);