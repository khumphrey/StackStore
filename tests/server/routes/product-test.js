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
	var testProduct = {
              title: "Mu opzor hu.",
              description: "Wu vo cut daz kirommiw monasawe tembu atoclu hauhu fu rasehlu puuka zo mebip ce hilbu lar sevjobbak gi jovonilet uhokva uhtod imumaizo pis todta cosin fi borunsi ce janhog.",
              price: 900,
              quantity: 3,
              photoUrl: "http://api.randomuser.me/portraits/thumb/men/16.jpg",
            };

    var testCategory = {name:"Test Boat"};


	beforeEach('Establish DB connection', function (done) {
		if (mongoose.connection.db) return done();
		mongoose.connect(dbURI, done);
	});

	afterEach('Clear test database', function (done) {
		clearDB(done);
	});

	xdescribe('guest/user should be able to get', function () {
		var guesTestProduct = testProduct;

	    var createProduct = function () {
	        return Category.create(testCategory)
	        .then(function(createdCategory){
	            guesTestProduct.categories = createdCategory._id;
	            return Product.create(guesTestProduct); 
	        });
	    };

		var guestAgent;

		beforeEach('Create a product', function (done) {
			createProduct().then(function(createdProd){
				guesTestProduct=createdProd;
				done();
			});
		});

		beforeEach('Create guest agent', function () {
			guestAgent = supertest.agent(app);
		});

		it('/api/products should return array of products', function (done) {
			guestAgent.get('/api/products').expect(200).end(function (err, response) {
				if (err) return done(err);
				expect(response.body).to.be.an('array');
				done();
			});
		});

		it('/api/products/:id should return one product', function (done) {
			guestAgent.get('/api/products/' + guesTestProduct._id).expect(200).end(function (err, response) {
				if (err) return done(err);
				expect(response.body.price).to.be.equal(guesTestProduct.price);
				done();
			});
		});

	});

	describe('Admin should be able to', function () {

		var loggedInAgent;

		var adminTestProduct;

		var adminInfo = {
			email: 'joe@gmail.com',
			password: 'shoopdawoop',
			admin: true
		};


		before('Create a category', function (done) {
			Category.create(testCategory)
			.then(function(createdCat){
				testCategory=createdCat;
				testProduct.categories = [testCategory._id];
				done();
			});
		});

		before('Create the admin', function (done) {
			User.create(adminInfo, done);
		});

		before('Create loggedIn admin and authenticate', function (done) {
			loggedInAgent = supertest.agent(app);
			loggedInAgent.post('/login').send(adminInfo).end(done);
		});

		it('create a new product', function (done) {
			loggedInAgent
			.post('/api/products')
			.send(testProduct)
			.expect(201)
			.end(function (err, res) {
				if (err) return done(err);
				adminTestProduct = res.body;
				expect(adminTestProduct.title).to.be.equal(testProduct.title);
				done();
			});
		});

		it('edit an existing product by id', function (done) {
			// console.log("adminTestProduct: ", adminTestProduct);
			loggedInAgent
			.put('/api/products/' + adminTestProduct._id)
			.send({
				title:'Santa Maria'
			})
			.expect(200)
			.end(function (err, res) {
				if (err) return done(err);
			// 	expect(res.body.title).to.be.equal("Santa Maria");
				done();
			});
		});

		xit("not edit a product that doesn't exist", function (done) {
			// console.log("adminTestProduct: ", adminTestProduct);
			loggedInAgent
			.put('/api/products/som12thing23random')
			.send({
				title:'Santa Maria'
			})
			.expect(404)
			.end(done);
		});

		it('delete an existing product by id', function (done) {
			// console.log("adminTestProduct: ", adminTestProduct);
			loggedInAgent
			.delete('/api/products/' + adminTestProduct._id)
			.expect(204)
			.end(done);
		});

	});

});
