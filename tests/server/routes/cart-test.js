// Instantiate all models
var mongoose = require('mongoose');
require('../../../server/db/models');
var User = mongoose.model('User');
var Product = mongoose.model('Product');
var Category = mongoose.model('Category');

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

	var cartItems = {
		item1: {
			product: "HEREISAPRODUCTID",
			quantity: 2
		},
		item2: {
			product: "HEREISADIFFERENTPRODUCTID",
			quantity: 3
		},
		item3: {
			product: "ANOTHERPRODUCTID",
			quantity: 5
		}
	}

	describe('unauthenticated requests', function () {

		var guestAgent;

		beforeEach('Create guest agent', function () {
			guestAgent = supertest.agent(app);
		})

		afterEach('Clear test database', function (done) {
			clearDB(done);
		});


		it('should have a GET request be an empty cart', function (done) {
			guestAgent.get('/api/cart/')
			.expect(200)
			.end(function (err, response) {
				if(err) done(err);
				expect(response.body).to.be.an('array');
				done();
			})
		});


		it('should post an item to the cart', function (done) {
			guestAgent.post('/api/cart/')
			.send({item: cartItems.item2})
			.expect(201)
			.end(function (err, response) {
				if(err) done(err);
				expect(response.body[0].product).to.equal(cartItems.item2.product);
				expect(response.body[0].quantity).to.equal(3);
				done();
			})
		});

		it('should post more than one item to the cart if unique', function (done) {
			guestAgent.post('/api/cart/')
			.send({item: cartItems.item1})
			.end(function (err, response) {
				if(err) done(err);
				guestAgent.post('/api/cart')
				.send({item: cartItems.item2})
				.expect(201)
				.end(function (err, response) {
					if(err) done(err);
					expect(response.body.length).to.equal(2);
					done();
				})
			})
		});

		it('should add to a qunatity if a posted product already exists', function (done) {
			guestAgent.post('/api/cart/')
			.send({item: cartItems.item1})
			.end(function (err, response) {
				if(err) done(err);
				guestAgent.post('/api/cart')
				.send({item: cartItems.item1})
				.expect(201)
				.end(function (err, response) {
					if(err) done(err);
					expect(response.body[0].quantity).to.equal(4);
					done();
				});
			});
		});

		it('should have a put request that updates a products quantity', function (done) {
			guestAgent.post('/api/cart/')
			.send({item: cartItems.item1})
			.end(function (err, response) {
				if(err) done(err);
				guestAgent.put('/api/cart')
				.send({index: 0, quantity: 5})
				.expect(200)
				.end(function (err, response) {
					if(err) done(err);
					expect(response.body[0].quantity).to.equal(5);
					done();
				});
			});
		});

		it('should delete an item from a cart', function (done) {
			guestAgent.post('/api/cart/')
			.send({item: cartItems.item1})
			.expect(201)
			.end(function (err, response) {
				if(err) done(err);
				guestAgent.post('/api/cart')
				.send({item: cartItems.item2})
				.expect(201)
				.end(function (err, response) {
					if(err) done(err);
					guestAgent.post('/api/cart/')
					.send({item: cartItems.item3})
					.expect(201)
					.end(function (err, response) {	
						if(err) done(err);
						expect(response.body.length).to.equal(3);
						guestAgent.delete('/api/cart/')
						.send({index: 1})
						.end(function (err, response) {
							if(err) done(err);
							expect(response.body.length).to.equal(2);
							done();
						})
					});
				});
			});
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

		afterEach('Clear test database', function (done) {
			clearDB(done);
		});

		it('should have a GET request be an empty cart', function (done){
			User.findOne({email: userInfo.email})
			.then(function (user){
				expect(user.cart).to.be.an('array');
				loggedInAgent.get('/api/cart/')
				.expect(200)
				.end(function (err, response) {
					if(err) done(err);
					expect(response.body).to.be.an('array');
					done();
				});
			})
			.then(null, done)			
		});

		it('should post an item to the cart', function (done) {

			var category, product;
			var testPrice = 900;
			
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
					loggedInAgent.post('/api/cart/')
					.send({item: {product: p._id, quantity: 5}})
					.expect(201)
					.end(function (err, response) {
						if(err) done(err);
						expect(response.body[0].product).to.equal(p._id.toString());
						done()
					})
				});
			});	
		});

		it('should post another item to the cart if unique', function (done) {

			var category, product;
			var testPrice = 900;
			
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
					loggedInAgent.post('/api/cart/')
					.send({item: {product: p, quantity: 5}})
					.expect(201)
					.end(function (err, response) {
						if(err) done(err);
						expect(response.body[0].product).to.equal(p._id.toString())
						return Product.create({
							title: "Mu opzor hu22",
			            	description: "22Wu vo cut daz kirommiw monasawe tembu atoclu hauhu fu rasehlu puuka zo mebip ce hilbu lar sevjobbak gi jovonilet uhokva uhtod imumaizo pis todta cosin fi borunsi ce janhog.",
			            	price: testPrice+2,
			            	categories: [category],
			            	quantity: 7,
			            	photoUrl: "http://api.randomuser.me/portraits/thumb/men/16.jpg",
						}).then(function(p){
							product = p; 
							loggedInAgent.post('/api/cart/')
							.send({item: {product: p, quantity: 5}})
							.expect(201)
							.end(function (err, response) {
								if(err) done(err);
								expect(response.body.length).to.equal(2);
								done();
							})
						})
					})
				})	
			});	
		});

		it('should update the quantity if the item already exists', function (done) {

			var category, product;
			var testPrice = 900;
			
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
					loggedInAgent.post('/api/cart/')
					.send({item: {product: p._id, quantity: 5}})
					.expect(201)
					.end(function (err, response) {
						if(err) done(err);
						expect(response.body[0].product).to.equal(p._id.toString())
						loggedInAgent.post('/api/cart/')
						.send({item: {product: p._id, quantity: 2}})
						.expect(201)
						.end(function (err, response) {
							if(err) done(err);
							expect(response.body.length).to.equal(1);
							expect(response.body[0].quantity).to.equal(7);
							done();
						})
					})
				});
			});	
		})

		xit('should delete a cart item', function (done) {
			var category, product;
			var testPrice = 900;
			
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
					loggedInAgent.post('/api/cart/')
					.send({item: {product: p._id, quantity: 5}})
					.expect(201)
					.end(function (err, response) {
						if(err) done(err);
						expect(response.body[0].product).to.equal(p._id.toString());
						loggedInAgent.post('/api/cart/')
						.send({item: {product: p._id, quantity: 5}})
						.expect(201)
						.end(function (err, response) {
							if(err) done(err);
							expect(response.body[0].product).to.equal(p._id.toString());
						})
					})
				});
			});	
		})

	});
});







