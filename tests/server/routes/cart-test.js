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

		beforeEach('Create guest agent', function() {
			guestAgent = supertest.agent(app);
		})

		it('should get a get an empty cart', function (done) {
			guestAgent.get('/api/cart/')
				.expect(response.body).to.equal([])
				.end(done);
		})
	})
})