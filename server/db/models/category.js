'use strict';
const mongoose = require('mongoose');

var categorySchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	}
});

mongoose.model('Category', categorySchema);