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

describe('Orders Routes', function() {

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
            }, {
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
                }, {
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
                }, {
                    title: "Black Pearl",
                    description: "Seas the day!",
                    price: 500,
                    quantity: 10,
                    categories: [createdCategories[0]]
                }]);
            })
            .then(function(products) {
                createdProducts = products;

                return Order.create([{
                    purchasedItems: [{
                        product: createdProducts[0],
                        quantity: 1
                    }, {
                        product: createdProducts[1],
                        quantity: 1
                    }],
                    user: createdUsers[0]._id,
                    streetAddress: "123 ABC",
                    city: "NYC",
                    state: "NY",
                    zipCode: 88888,
                    shippingEmail: "me@aol.com"
                }, {
                    purchasedItems: [{
                        product: createdProducts[0],
                        quantity: 1
                    }, {
                        product: createdProducts[1],
                        quantity: 1
                    }],
                    streetAddress: "456 DEF",
                    city: "NYC",
                    state: "NY",
                    zipCode: 88888,
                    shippingEmail: "you@aol.com"
                }]);
            })
            .then(function(orders) {
                createdOrders = orders;
                done();
            })
            .then(null, done);
    });

    afterEach('Clear test database', function(done) {
        clearDB(done);
    });

    describe('Unauthenticated user', function() {

        var guestAgent;

        beforeEach('Create guest agent', function() {
            guestAgent = supertest.agent(app);
        });

        it('should get 401 for get all orders', function(done) {
            guestAgent.get('/api/orders')
                .expect(401)
                .end(done);
        });

        it('should get 401 for get one order', function(done) {
            guestAgent.get('/api/orders/' + createdOrders[0]._id)
                .expect(401)
                .end(done);
        });

        it('should get 401 for put on order', function(done) {
            guestAgent.put('/api/orders/' + createdOrders[0]._id)
                .expect(401)
                .end(done);
        });

        //having trouble figuring out how to add on to the req.session.cart from testing 
        xit('should get a 201 for a post with the order on the response body', function(done) {
            guestAgent.post('/api/orders')
                .send({
                    purchasedItems: [{
                        product: createdProducts[0],
                        quantity: 1
                    }, {
                        product: createdProducts[1],
                        quantity: 2
                    }],
                    streetAddress: "456 DEF",
                    city: "NYC",
                    state: "NY",
                    zipCode: 88888,
                    shippingEmail: "me@email.com"
                })
                .expect(201)
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(res.body.orderStatus).to.be.an('Created');

                    done();
                });

        });

    });

    describe('Authenticated user', function() {

        var loggedInAgent;

        beforeEach('Create loggedIn user agent and authenticate', function(done) {
            loggedInAgent = supertest.agent(app);
            var user = {
                email: createdUsers[0].email,
                password: createdUsers[0].password
            };
            loggedInAgent.post('/login').send(user).end(done);
        });


        it('should get 403 for get all orders', function(done) {
            loggedInAgent.get('/api/orders')
                .expect(403)
                .end(done);
        });

        it('should get 403 for get one order that was not made by user', function(done) {
            loggedInAgent.get('/api/orders/' + createdOrders[1]._id)
                .expect(403)
                .end(done);
        });

        it('should get 200 for get one order that was made by user', function(done) {
            loggedInAgent.get('/api/orders/' + createdOrders[0]._id)
                .expect(200)
                .end(done);
        });

        it('should get 403 for put on order that was not made by user', function(done) {
            loggedInAgent.put('/api/orders/' + createdOrders[1]._id)
                .send({ orderStatus: "Cancelled" })
                .expect(403)
                .end(done);
        });

        it('should get 400 for put on order if the change is not to cancel status', function(done) {
            loggedInAgent.put('/api/orders/' + createdOrders[0]._id)
                .send({ orderStatus: "Processing" })
                .expect(400)
                .end(done);
        });

        it('should get 200 for put on order that is appropriate', function(done) {
            loggedInAgent.put('/api/orders/' + createdOrders[0]._id)
                .send({ orderStatus: "Cancelled" })
                .expect(200)
                .end(done);
        });

        it('should get a 400 for incomplete post', function(done) {
            loggedInAgent.post('/api/orders')
                .send({
                    streetAddress: "456 DEF",
                    city: "NYC",
                    state: "NY",
                    zipCode: 88888
                })
                .expect(400)
                .end();

            loggedInAgent.post('/api/orders')
                .send({
                    shippingEmail: "me@email.com"
                })
                .expect(400)
                .end();

            User.findByIdAndUpdate(createdUsers[0]._id, {
                    cart: []
                })
                .then(function() {
                    loggedInAgent.post('/api/orders')
                        .send({
                            streetAddress: "456 DEF",
                            city: "NYC",
                            state: "NY",
                            zipCode: 88888,
                            shippingEmail: "me@email.com"
                        })
                        .expect(400)
                        .end(done);
                });
        });

        it('should get a 201 for appropriate post', function(done) {
            //add to User.cart
            User.findByIdAndUpdate(createdUsers[0]._id, {
                    cart: [{
                        product: createdProducts[0],
                        quantity: 1
                    }, {
                        product: createdProducts[1],
                        quantity: 2
                    }]
                })
                .then(function() {
                    loggedInAgent.post('/api/orders')
                        .send({
                            streetAddress: "5 Hanover Sq",
                            city: "NYC",
                            state: "NY",
                            zipCode: 88888,
                            shippingEmail: "me@email.com",
                            purchasedItems: [{
                                product: createdProducts[0],
                                quantity: 1
                            }, {
                                product: createdProducts[1],
                                quantity: 2
                            }]
                        })
                        .expect(201)
                        .end(function(err, res) {
                            if (err) return done(err);
                            expect(res.body.orderStatus).to.equal('Created');
                            expect(res.body.purchasedItems[0].price).to.not.be.null;
                            Order.findById(res.body._id)
                                .then(function (order) {
                                    expect(order).to.not.be.null;
                                    done();
                                })
                                .then(null, done)
                        });
                });
        });
    });

    describe('Authenticated Admin user', function() {

        var loggedInAgent;

        beforeEach('Create loggedIn user agent and authenticate', function(done) {
            loggedInAgent = supertest.agent(app);
            var adminUser = {
                email: createdUsers[1].email,
                password: createdUsers[1].password
            };
            loggedInAgent.post('/login').send(adminUser).end(done);
        });


        it('should get 200 for get all orders and the response should be an array', function(done) {
            loggedInAgent.get('/api/orders')
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(res.body).to.be.an('array');
                    done();
                });
        });

        it('should get 200 for get one order', function(done) {
            loggedInAgent.get('/api/orders/' + createdOrders[0]._id)
                .expect(200)
                .end(done);
        });

        it('should get 200 for put on order that is appropriate', function(done) {
            loggedInAgent.put('/api/orders/' + createdOrders[0]._id)
                .send({ orderStatus: "Processing" })
                .expect(200)
                .end(done);
        });
    });

    xdescribe('Creating a new order', function() {

        it('should not work if any of the items is not in stock', function(done) {

        });

        it('should reduce the inventory quantity of all the products by the correct amount', function(done) {

        });

        it('should send a confirmation email to the shipping email address', function(done) {

        });

        it('should fail if there are no items in the cart', function(done) {

        });

        it('should fail if the cart does have incorrect products or quantities', function(done) {

        });

    });

});
