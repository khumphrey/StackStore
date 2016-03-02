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

describe('Orders Routes', function() {

	beforeEach('Establish DB connection', function(done) {
		if (mongoose.connection.db) return done();
		mongoose.connect(dbURI, done);
	});

	var createdCart;
	var createdUsers;
	var createdCategories;
	var createdProducts;


	beforeEach('Create mock order data', function(done) {

		User.create([{
			email: "bob@email.com",
			password: "secret"
		},
		{
			email: "joe@email.com",
			password: "supersecret",
			admin: true
		}])
		.then(function(users) {
			createdUsers = users;
			// We'll need the unhashed passwords for testing authenitcation later
			createdUsers[0].password = 'secret';
			createdUsers[1].password = 'supersecret';

			return Category.create([{
				name: "Partyboats",
			},
			{
				name: "Pirateships"
			}]);

		})
		.then(function(categories) {
			createdCategories = categories;

			return Product.create([{
				title: "Superboat",
				description: "This boat can float very well.",
				price: 1000,
				quantity: 20,
				categories: createdCategories
			},
			{
				title: "Black Pearl",
				description: "Seas the day!",
				price: 500,
				quantity: 10,
				categories: [createdCategories[0]]
			}]);
		})
		.then(function(products) {
			createdProducts = products;
			done();
		})
		.then(null, done);
	});

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
				var guestAgent = supertest.agent(app);

				guestAgent.post('/api/orders')
					.send({
						purchasedItems: [{
							product: createdProducts[0],
							quantity: 1
						},
						{
							product: createdProducts[1],
							quantity: 2
						}],
						shippingAddress: "My house",
						shippingEmail: "me@email.com"
					});

			});

		});

		describe('as a logged in user', function() {

			it('should create a new order and return the order with status 201', function(done) {

			});

		});

	});

});
