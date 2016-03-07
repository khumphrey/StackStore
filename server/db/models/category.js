'use strict';
const mongoose = require('mongoose');

var categorySchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	}
});

// add pre delete hook to remove category ref in product

mongoose.model('Category', categorySchema);