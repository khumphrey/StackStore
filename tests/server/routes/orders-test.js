// Instantiate all models
var mongoose = require('mongoose');
require('../../../server/db/models');
var User = mongoose.model('User');
var Review = mongoose.model('Review');
var Product = mongoose.model('Product');
var Category = mongoose.model('Category');

var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var app = require('../../../server/app');

describe('Reviews Route', function() {

	beforeEach('Establish DB connection', function(done) {
		if (mongoose.connection.db) return done();
		mongoose.connect(dbURI, done);
	});

	var createdCart;


	// Create mock data
	// carts etc.

	afterEach('Clear test database', function(done) {
		clearDB(done);
	});


	xdescribe('Creating a new order',function() {

		it('should not work if any of the items is not in stock', function(done) {

		});

		it('should reduce the inventory quantity of all the products by the correct amount', function(done) {

		});

		it('should send a confirmation email to the shipping email address', function(done) {

		});

		it('should fail if there are no items in the cart', function(done) {

		});

		it('should fail if the cart does have incorrect products or quantities', function(done) {

		});

		describe('as a guest user', function() {

			it('should create a new order and return the order with status 201', function(done) {

			});

		});

		describe('as a logged in user', function() {

			it('should create a new order and return the order with status 201', function(done) {

			});

		});

	});

});
