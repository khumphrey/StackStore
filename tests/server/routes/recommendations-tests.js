var mongoose = require('mongoose');
require('../../../server/db/models');
var User = mongoose.model('User');
var Review = mongoose.model('Review');
var Product = mongoose.model('Product');
var Category = mongoose.model('Category');
var Order = mongoose.model('Order');

var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var app = require('../../../server/app');

describe('Recommendation Engine', function() {

	beforeEach('Establish DB connection', function(done) {
		if (mongoose.connection.db) return done();
		mongoose.connect(dbURI, done);
	});

	var createdCart;
	var createdUsers;
	var createdCategories;
	var createdProducts;
	var createdOrders;


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
			},
			{
				title: "Another ship",
				description: "breaking wakes",
				price: 700,
				quantity: 15,
				categories: [createdCategories[0]]
			}
			]);
		})
		.then(function(products) {
			createdProducts = products;

			return Order.create([{
					purchasedItems: [{
						product: createdProducts[0],
						quantity: 1
					},
					{
						product: createdProducts[1],
						quantity: 1
					}],
					user: createdUsers[0]._id,
					shippingAddress: "123 ABC",
					shippingEmail: "me@aol.com"
				},
				{
					purchasedItems: [{
						product: createdProducts[1],
						quantity: 1
					},
					{
						product: createdProducts[2],
						quantity: 1
					}],
					shippingAddress: "456 DEF",
					shippingEmail: "you@aol.com"
				},
				{
					purchasedItems: [{
						product: createdProducts[0],
						quantity: 1
					},
					{
						product: createdProducts[2],
						quantity: 1
					}],
					shippingAddress: "456 DEF",
					shippingEmail: "you@aol.com"
				}
				]);
		})
		.then(function(orders) {
			createdOrders = orders;
			done();
		})
		.then(null, done);
	});

	afterEach('Clear test database', function (done) {
		clearDB(done);
	});

	it('basic test', function (done) {
		let guestAgent = supertest(app);

		guestAgent.get('/api/recommendations/?productId=' + createdProducts[0]._id)
			.end(function(err, response) {
				if (err) done(err);
				console.log("recommended items: ", response.body[0].purchasedItems, 
					response.body[1].purchasedItems,
					response.body[2].purchasedItems);
				done();
			})
	});

});