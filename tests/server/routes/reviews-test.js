// Instantiate all models
var mongoose = require('mongoose');
require('../../../server/db/models');
var User = mongoose.model('User');
var Review = mongoose.model('Review');
var Product = mongoose.model('Product');
var Category = mongoose.model('Category');

var ObjectId = mongoose.Schema.Types.ObjectId;

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

	beforeEach('Create mock review data', function(done) {

		var createdCategories;
		var createdUsers;
		var createdProducts;
		var createdReviews;

		User.create([{
			email: "bob@email.com",
			password: "secret"
		},
		{
			email: "joe@email.com",
			password: "supersecret"
		}])
		.then(function(users) {
			createdUsers = users;

			return Category.create([{
				name: "Partyboats",
			},
			{
				name: "Pirateships"
			}]);

		})
		.then(function(categories) {
			var createdCategories = categories;

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

			return Review.create([{
				product: createdProducts[0]._id,
				user: createdUsers[0]._id,
				content: "This product is excellent",
				starRating: 5
			},
			{
				product: createdProducts[0]._id,
				user: createdUsers[1]._id,
				content: "This product is average",
				starRating: 3
			},
			{
				product: createdProducts[1]._id,
				user: createdUsers[0]._id,
				content: "This product is horrible",
				starRating: 1
			}]);
		})
		.then(function(reviews) {
			createdReviews = reviews;
			console.log("created reviews: ", createdReviews);
		})
		.then(function() {done();})
		.then(null, done);


	});

	afterEach('Clear test database', function(done) {
		clearDB(done);
	});

	describe('Fetching all reviews', function() {

		var guestAgent;

		beforeEach('Create guest agent', function() {
			guestAgent = supertest.agent(app);
		});

		it('should return all reviews', function(done) {
			guestAgent.get('/api/reviews/')
				.expect(200)
				.end(function(err, response) {
					if (err) return done(err);
					expect(response.body).to.be.an('array');
					done();
				});
		});

	});

});