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

	var createdReviews;
	var createdCategories;
	var createdUsers;
	var createdProducts;

	beforeEach('Create mock review data', function(done) {

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

		it('should return all reviews of a user when a query is passed', function(done) {
			guestAgent.get('/api/reviews'+'?user=' + createdUsers[0]._id)
				.expect(200)
				.end(function(err, response) {
					if (err) return done(err);
					expect(response.body).to.be.an('array');
					expect(response.body.length).to.equal(2);
					done();
				});
		});

		it('should return all reviews for a product when a query is passed', function(done) {
			guestAgent.get('/api/reviews'+'?product=' + createdProducts[1]._id)
				.expect(200)
				.end(function(err, response) {
					if (err) return done(err);
					expect(response.body).to.be.an('array');
					expect(response.body.length).to.equal(1);
					done();
				});
		});
	});

	describe('Fetch one review', function() {

		var guestAgent;

		beforeEach('Create guest agent', function() {
			guestAgent = supertest.agent(app);
		});

		it('should return the correct review', function(done) {
			guestAgent.get('/api/reviews/' + createdReviews[0]._id)
				.expect(200)
				.end(function(err, response) {
					if (err) return done(err);
					expect(response.body.content).to.equal(createdReviews[0].content);
					done();
				});
		});

		it('should return 404 if review does not exist', function(done) {
			guestAgent.get('/api/reviews/' + 'abcd')
				.expect(404)
				.end(done);
		});

	});

	describe('Post a new review', function() {

		describe('(Unauthicated request)', function() {

			var guestAgent;
			var newReviewContent = "I emphasize this is good!";

			beforeEach('Create guest agent', function() {
				guestAgent = supertest.agent(app);
			});

			it('should reject the post if you are not authenticated', function(done) {
				guestAgent.post('/api/reviews')
					.send({
						product: createdProducts[0]._id,
						user: createdUsers[0]._id,
						content: newReviewContent,
						starRating: 4
					})
					.expect(401)
					.end(done);
			});

		});

		describe('(Authenticated request)', function() {
			var loggedInAgent;

			beforeEach('Create loggedIn user agent and authenticate', function (done) {
				loggedInAgent = supertest.agent(app);
				loggedInAgent.post('/login').send({
					email: createdUsers[0].email,
					password: createdUsers[0].password
				}).end(done);
			});

			it('should return status 200 and the created review', function(done) {
				var newReviewContent = "I emphasize this is good!";

				loggedInAgent.post('/api/reviews')
					.send({
						product: createdProducts[0]._id,
						user: createdUsers[0]._id,
						content: newReviewContent,
						starRating: 4
					}) 
					.expect(200)
					.end(function(err, response) {
						expect(response.body.content).to.equal(newReviewContent);
						done();
					});
			});
		});
	});

	describe('Update a review', function() {

		var updatedContent = "this is the new content";
		
		describe('(Unauthicated request)', function() {

			var guestAgent;

			beforeEach('Create guest agent', function() {
				guestAgent = supertest.agent(app);
			});

			it('should not be allowed to update a review', function(done) {
				guestAgent.put('/api/reviews/' + createdReviews[0]._id)
					.send({content: updatedContent})
					.expect(401)
					.end(done);
			});

		});

		describe('(Authenticated request)', function() {

			var loggedInAgent;

			beforeEach('Create loggedIn user agent and authenticate', function (done) {
				loggedInAgent = supertest.agent(app);
				loggedInAgent.post('/login').send({
					email: createdUsers[0].email,
					password: createdUsers[0].password
				}).end(done);
			});

			it('should return the updated review', function(done) {
				loggedInAgent.put('/api/reviews/' + createdReviews[0]._id)
					.send({content: updatedContent})
					.expect(200)
					.end(function(err, response) {
						expect(response.body.content).to.equal(updatedContent);
						done();
					});
			});

			// review 1 is not created by user 0 -> 403
			it('should only be allowed to update ones own review', function(done) {
				loggedInAgent.put('/api/reviews/' + createdReviews[1]._id)
					.send({content: updatedContent})
					.expect(403)
					.end(done);
			});
		});

		describe('(Admin request)', function() {
			var adminAgent;

			// user 1 is an admin
			beforeEach('Create admin user agent and authenticate', function (done) {
				adminAgent = supertest.agent(app);
				adminAgent.post('/login').send({
					email: createdUsers[1].email,
					password: createdUsers[1].password
				}).end(done);
			});

			// review 2 is created by user 0, but user 1 is admin
			it('an admin can edit any review', function(done) {
				adminAgent.put('/api/reviews/' + createdReviews[0]._id)
					.send({content: updatedContent})
					.expect(200)
					.end(function(err, response) {
						expect(response.body.content).to.equal(updatedContent);
						done();
					});
			});	
		});
	});

	describe('Delete a review', function() {

		describe('(Unauthicated request)', function() {

			var guestAgent;

			beforeEach('Create guest agent', function() {
				guestAgent = supertest.agent(app);
			});

			it('should not allow a guest to delete any review', function(done) {
				guestAgent.delete('/api/reviews/' + createdReviews[0]._id)
					.expect(401)
					.end(done);
			});

		});

		describe('(Authenticated request)', function() {
			var loggedInAgent;

			beforeEach('Create loggedIn user agent and authenticate', function (done) {
				loggedInAgent = supertest.agent(app);
				loggedInAgent.post('/login').send({
					email: createdUsers[0].email,
					password: createdUsers[0].password
				}).end(done);
			});

			// review 1 is not created by user 0 -> 403
			it('should only allow to delete your own reviews as a user', function(done) {
				loggedInAgent.delete('/api/reviews/' + createdReviews[1]._id)
					.expect(403)
					.end(done);
			});

			// review 0 is created by user 0 ->204
			it('should return 204 if the review is deleted', function(done) {
				loggedInAgent.delete('/api/reviews/' + createdReviews[0]._id)
					.expect(204)
					.end(function(err, response) {
						loggedInAgent.get('/api/reviews/' + createdReviews[0]._id)
							.expect(404)
							.end(done);
					});
			});
		});

		describe('(Admin request)', function() {
			var adminAgent;

			// user 1 is an admin
			beforeEach('Create admin user agent and authenticate', function (done) {
				adminAgent = supertest.agent(app);
				adminAgent.post('/login').send({
					email: createdUsers[1].email,
					password: createdUsers[1].password
				}).end(done);
			});

			// review 2 is created by user 0
			it('should allow an admin to delete any review', function(done) {
				adminAgent.delete('/api/reviews/' + createdReviews[2]._id)
					.expect(204)
					.end(function(err, response) {
						adminAgent.get('/api/reviews/' + createdReviews[2]._id)
							.expect(404)
							.end(done);
					});
			});	
		});
	});
});