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
	}
});

mongoose.model('Review', reviewSchema);