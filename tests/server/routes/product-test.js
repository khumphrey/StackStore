// Instantiate all models
var mongoose = require('mongoose');
require('../../../server/db/models');
var User = mongoose.model('User');
var Category = mongoose.model('Category');
var Product = mongoose.model('Product');

var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var app = require('../../../server/app');

describe('Product Routes', function () {
	var category, product;
	var testPrice = 900;

	beforeEach('Establish DB connection', function (done) {
		if (mongoose.connection.db) return done();
		mongoose.connect(dbURI, done);
	});

	afterEach('Clear test database', function (done) {
		clearDB(done);
	});


	describe('guest/user should be able to', function () {
		var guestAgent, category, product;
		var testPrice = 900;

		beforeEach(function(done){
			Category.create({
				name:"Test Boat"
			}, function (err, c) {
				if (err) return done(err);
				category = c;
				return Product.create({
					title: "Mu opzor hu.",
		            description: "Wu vo cut daz kirommiw monasawe tembu atoclu hauhu fu rasehlu puuka zo mebip ce hilbu lar sevjobbak gi jovonilet uhokva uhtod imumaizo pis todta cosin fi borunsi ce janhog.",
		            price: testPrice,
		            categories: [category],
		            quantity: 3,
		            photoUrl: "http://api.randomuser.me/portraits/thumb/men/16.jpg",
				}).then(function(p){
					product = p; 
					done();
				});
			});
		});

		beforeEach('Create guest agent', function () {
			guestAgent = supertest.agent(app);
		});

		it('get /api/products should return array of products', function (done) {
			guestAgent.get('/api/products').expect(200).end(function (err, res) {
				if (err) return done(err);
				expect(res.body).to.be.an('array');
				done();
			});
		});

		it('get /api/products/:id should return one product', function (done) {
			guestAgent.get('/api/products/' + product._id).expect(200).end(function (err, res) {
				if (err) return done(err);
				expect(res.body.price).to.be.equal(testPrice);
				done();
			});
		});

		it('not put existing product by id', function (done) {
			guestAgent
			.put('/api/products/' + product._id)
			.send({
				title:'Santa Maria'
			})
			.expect(401)
			.end(done);
		});

		it('not delete an existing product by id', function (done) {
			guestAgent
			.delete('/api/products/' + product._id)
			.expect(401)
			.end(done);
		});

	});

	describe('Admin should be able to', function () {
		var loggedInAgent, category, product;
		var testPrice = 900;

		beforeEach(function(done){
			Category.create({
				name:"Test Boat"
			}, function (err, c) {
				if (err) return done(err);
				category = c;
				return Product.create({
					title: "Mu opzor hu.",
		            description: "Wu vo cut daz kirommiw monasawe tembu atoclu hauhu fu rasehlu puuka zo mebip ce hilbu lar sevjobbak gi jovonilet uhokva uhtod imumaizo pis todta cosin fi borunsi ce janhog.",
		            price: testPrice,
		            categories: [category],
		            quantity: 3,
		            photoUrl: "http://api.randomuser.me/portraits/thumb/men/16.jpg",
				}).then(function(p){
					product = p; 
					done();
				});
			});
		});

		var adminTestProduct = {
			title: "Pinto",
	        description: "One of the first ships to land in the New World.",
	        price: 2000,
	        quantity: 1,
	        photoUrl: "http://api.randomuser.me/portraits/thumb/men/6.jpg",
		};

		var adminInfo = {
			email: 'joe@gmail.com',
			password: 'shoopdawoop',
			admin: true
		};

		beforeEach('Create the admin', function (done) {
			User.create(adminInfo, done);
		});

		beforeEach('Create loggedIn admin and authenticate', function (done) {
			loggedInAgent = supertest.agent(app);
			loggedInAgent.post('/login').send(adminInfo).end(done);
		});

		it('create a new product', function (done) {
			loggedInAgent
			.post('/api/products')
			.send(adminTestProduct)
			.expect(201)
			.end(function (err, res) {
				if (err) return done(err);
				expect(res.body.title).to.be.equal(adminTestProduct.title);
				Product.findById(res.body._id, function (err, b) {
							if (err) return done(err);
							expect(b).to.not.be.null;
							done();
						});
			});
		});

		it('edit an existing product by id', function (done) {
			loggedInAgent
			.put('/api/products/' + product._id)
			.send({
				title:'Santa Maria'
			})
			.expect(200)
			.end(function (err, res) {
				if (err) return done(err);
				expect(res.body.title).to.be.equal("Santa Maria");
				done();
			});
		});

		it("not edit a product that doesn't exist", function (done) {
			loggedInAgent
			.put('/api/products/som12thing23random')
			.send({
				title:'This does not matter'
			})
			.expect(404)
			.end(done);
		});

		it('delete an existing product by id', function (done) {
			loggedInAgent
			.delete('/api/products/' + product._id)
			.expect(204)
			.end(done);
		});

		it("not delete a product that doesn't exist", function (done) {
			loggedInAgent
			.delete('/api/products/som12thing23random')
			.expect(404)
			.end(done);
		});

	});

});
