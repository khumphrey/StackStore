// Instantiate all models
var mongoose = require('mongoose');
require('../../../server/db/models');
var User = mongoose.model('User');

var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var app = require('../../../server/app');

describe('Cart Route', function () {

	beforeEach('Establish DB connection', function (done) {
		if (mongoose.connection.db) return done();
		mongoose.connect(dbURI, done);
	});

	afterEach('Clear test database', function (done) {
		clearDB(done);
	});

	describe('unauthenticated requests', function () {

		var guestAgent;

		beforeEach('Create guest agent', function () {
			guestAgent = supertest.agent(app);
		})

		it('should have a GET request be an empty cart', function (done) {
			guestAgent.get('/api/cart/')
			.expect(200)
			.expect([], done)
		});


		it('should add an item to the cart', function (done) {
			var cartItem = {
				product: "HEREISAPRODUCTID",
				quantity: "1"
			}

			guestAgent.post('/api/cart/')
			.send({item: cartItem})
			.expect(201)
			.expect([cartItem], done);
		})

	});

	describe('authenticated requests', function () {
		var loggedInAgent;

		var userInfo = {
			email: 'joe@gmail.com',
			password: 'shoopdawoop'
		};

		beforeEach('Create a user', function (done) {
			User.create(userInfo, done);
		});

		beforeEach('Create loggedIn user agent and authenticate', function (done) {
			loggedInAgent = supertest.agent(app);
			loggedInAgent.post('/login').send(userInfo).end(done);
		});

		it('should have a GET request be an empty cart', function (done){
			loggedInAgent.get('/api/cart/')
			.expect(200)
			.expect([], done)
		});
	});
});