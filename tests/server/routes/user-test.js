// Instantiate all models
var mongoose = require('mongoose');
require('../../../server/db/models'); //what is the point of this? Pulled it from current members-only-test
var User = mongoose.model('User');

var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var app = require('../../../server/app');

describe('Users Route', function () {

	beforeEach('Establish DB connection', function (done) {
		if (mongoose.connection.db) return done();
		mongoose.connect(dbURI, done);
	});

	afterEach('Clear test database', function (done) {
		clearDB(done);
	});

	describe('Unauthenticated request', function () {

		var guestAgent;

		beforeEach('Create guest agent', function () {
			guestAgent = supertest.agent(app);
		});

		it('should get a 401 response for get all request', function (done) {
			guestAgent.get('/api/users')
				.expect(401)
				.end(done);
		});

		it('should get a 401 response for get by userId', function (done) {
			guestAgent.get('/api/users/fakeuserid')
				.expect(401)
				.end(done);
		});

		it('should get a 401 response for put request', function (done) {
			guestAgent.put('/api/users/fakeuserid')
				.expect(401)
				.end(done);
		});

		it('should get a 401 response for post request', function (done) {
			guestAgent.post('/api/users')
				.send({
					email: 'j@j.j',
					password: 'j'
				})
				.expect(401)
				.end(done);
		});

	});

	describe('Authenticated request', function () {

		var loggedInAgent, userId;

		var userInfo = {
			email: 'k@k.k',
			password: 'k'
		};

		var secondUserInfo = {
			email: 'j@j.j',
			password: 'j'
		};

		beforeEach('Create a user', function (done) {
			User.create(userInfo)
			.then(function (createdUser) {
				userId = createdUser._id;
				done();
			});
			User.create(secondUserInfo, done);
		});

		beforeEach('Create loggedIn user agent and authenticate', function (done) {
			loggedInAgent = supertest.agent(app);
			loggedInAgent.post('/login').send(userInfo).end(done);
		});

		
		it('should get a 401 response for get all request', function (done) {
			loggedInAgent.get('/api/users')
				.expect(401)
				.end(done);
		});

		it('should get with 200 response and with a user as the body', function (done) {
			loggedInAgent.get('/api/users/'+userId).expect(200).end(function (err, response) {
				if (err) return done(err);
				expect(response.body.email).to.equal(userInfo.email);
				done();
			});
		});

		it('should get a 200 response for put request with the updated user as the response', function (done) {
			loggedInAgent.put('/api/users/'+userId)
				.send({ fullname: "Kate" })
				.expect(200).end(function (err, response) {
				if (err) return done(err);
				expect(response.body.fullname).to.equal("Kate");
				done();
			});
		});

		it('should get a 401 response for post request', function (done) {
			loggedInAgent.post('/api/users')
				.send({
					email: 'l@l.l',
					password: 'l'
				})
				.expect(401)
				.end(done);
		});
	});

	describe('Authenticated Administrative request', function () {

		var loggedInAgent, userId, secondUserId;

		var userInfo = {
			email: 'k@k.k',
			password: 'k',
			admin: 'true'
		};

		var secondUserInfo = {
			email: 'j@j.j',
			password: 'j'
		};

		beforeEach('Create users', function (done) {
			User.create(userInfo)
			.then(function (createdUser) {
				userId = createdUser._id;
				done();
			});
			User.create(secondUserInfo)
			 	.then(function (createdUser) {
				secondUserId = createdUser._id;
				done();
			});
		});

		beforeEach('Create loggedIn admin user agent and authenticate', function (done) {
			loggedInAgent = supertest.agent(app);
			loggedInAgent.post('/login').send(userInfo).end(done);
		});

		it('should get with 200 response and an array as the body', function (done) {
			loggedInAgent.get('/api/users').expect(200).end(function (err, response) {
				if (err) return done(err);
				expect(response.body).to.be.an('array');
				done();
			});
		});

		it('should get with 200 response for a get by userId request and a user as the body', function (done) {
			loggedInAgent.get('/api/users/'+userId).expect(200).end(function (err, response) {
				if (err) return done(err);
				expect(response.body.email).to.equal(userInfo.email);
				done();
			});
		});

		it('should get a 200 response for put request with the updated user as the response', function (done) {
			loggedInAgent.put('/api/users/'+secondUserId)
				.send({ 
					admin: "true",
					fullname: "Kate" 
				})
				.expect(200).end(function (err, response) {
				if (err) return done(err);
				expect(response.body.fullname).to.equal("Kate");
				expect(response.body.admin).to.equal("true");
				done();
			});
		});

		it('should get a 201 response for post request', function (done) {
			loggedInAgent.put('/api/users/')
				.send({
					email: 'l@l.l',
					password: 'l'
				})
				.expect(201).end(function (err, response) {
				if (err) return done(err);
				expect(response.body.email).to.equal("l@l.l");
				done();
			});
		});
	});

});