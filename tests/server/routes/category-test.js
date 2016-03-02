var mongoose = require('mongoose');

var Category = mongoose.model('Category');
var User = mongoose.model('User');

var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var app = require('../../../server/app');

describe('Category Route', function () {
	
	var catId;

	beforeEach('Establish DB connection', function (done) {
		if (mongoose.connection.db) return done();
		mongoose.connect(dbURI, done);
	});

	beforeEach('Create categories and save one Id', function (done) {
		Category.create([
			{ name: "Luxury" },
			{ name: "Submersible" },
			{ name: "inflatable" } ])
			.then(function (arrCategories) {
				catId = arrCategories[0]._id;
				done();
			})
		;
	});

	afterEach('Clear test database', function (done) {
		clearDB(done);
	});

	describe('Unauthenticated request for categories', function () {

		var guestAgent;

		beforeEach('Create guest agent', function () {
			guestAgent = supertest.agent(app);
		});

		it('should get a 200 response for get all request', function (done) {
			guestAgent.get('/api/categories')
				.expect(200)
				.end(done);
		});

		it('should get a 404 response for invalid get request', function (done) {
			guestAgent.get('/api/categories/fakeId')
				.expect(404)
				.end(done);
		});

		it('should get a 200 response for get by CategoryId', function (done) {
			guestAgent.get('/api/categories/' + catId)
				.expect(200)
				.end(done);
		});

		it('should get a 401 response for put request', function (done) {
			guestAgent.put('/api/categories/'+ catId)
				.expect(401)
				.end(done);
		});

		it('should get a 401 response for post request', function (done) {
			guestAgent.post('/api/categories')
				.send({ name: "New" })
				.expect(401)
				.end(done);
		});

	});

	describe('Authenticated Administrative request', function () {

		var loggedInAgent;

		beforeEach('Create Admin User', function (done) {
			User.create({
				email: "k",
				password: "k",
				admin: true
			}, done);
		});

		beforeEach('Create loggedIn Category agent and authenticate', function (done) {
			loggedInAgent = supertest.agent(app);
			loggedInAgent.post('/login')
				.send({ 
					email: "k",
					password: "k"
				})
				.end(done);
		});

		it('should get a 200 response for put request', function (done) {
			loggedInAgent.put('/api/categories/'+ catId)
				.send({ name: "New Name"})
				.expect(200)
				.end(function (err, res) {
					if (err) return done(err);
					Category.findById(catId, function (err, category) {
						if (err) return done(err);
						expect(res.body.name).to.equal(category.name);
						done();	
						
					}); 
				});
		});

		it('should get a 201 response for post request', function (done) {
			loggedInAgent.post('/api/categories')
				.send({ name: "New" })
				.expect(201)
				.end(function (err, res) {
					if (err) return done(err);
					Category.findById(res.body._id, function (err, category) {
						if (err) return done(err);
						expect(category).to.not.be.null;
						done();
					});
				});
		});

	});

});