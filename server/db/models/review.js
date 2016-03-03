'use strict';
const mongoose = require('mongoose');

var reviewSchema = new mongoose.Schema({
	product: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Product',
		required: true
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	content: {
		type: String,
		required: true,
		minlength: 10
	},
	starRating: {
		type: Number,
		enum: [1,2,3,4,5],
		required: true
	}
});

mongoose.model('Review', reviewSchema);