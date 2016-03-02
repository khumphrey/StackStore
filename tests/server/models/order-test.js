var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var sinon = require('sinon');
var expect = require('chai').expect;
var mongoose = require('mongoose');

// Require in all models.
require('../../../server/db/models');

var Order = mongoose.model('Order');
var Product = mongoose.model('Product');
var Category = mongoose.model('Category');


describe('Order model', function () {

    beforeEach('Establish DB connection', function (done) {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);
    });

    afterEach('Clear test database', function (done) {
        clearDB(done);
    });

    describe('pre save validation hook', function () {

        var createProducts = function () {

            return Category.create([{
                name: "Partyboats",
            },
            {
                name: "Pirateships"
            }])
            .then(function(categories) {
            return Product.create([{
                title: "my first product",
                description: "this is a good product",
                price: 10,
                quantity: 5,
                categories: categories,
                reviews: []
            },
            {
                title: "my second product",
                description: "this is a mediocre product",
                price: 5,
                quantity: 2,
                categories: categories,
                reviews: []
            }]);
            });
        };

        it('should subtract the ordered quantity from the product inventory', function (done) {
            var createdProducts;

            createProducts()
                .then(function(products) {
                    createdProducts = products;
                    return Order.create({
                        purchasedItems: [{
                            product: products[0],
                            quantity: 3
                        },
                        {
                            product: products[1],
                            quantity: 2
                        }],
                        shippingAddress: "the address",
                        shippingEmail: "email@emailcom"
                    });
                })
                .then(function(order) {
                    // check if quantities are lower
                    return Product.findOne({_id: createdProducts[0]._id});
                })
                .then(function(product1) {
                    expect(product1.quantity).to.equal(2);
                    return Product.findOne({_id: createdProducts[1]._id});
                })
                .then(function(product2) {
                    expect(product2.quantity).to.equal(0);
                    done();
                })
                .then(null, done);
        });

        it('should fail validation if cart is empty', function(done) {
            var createdProducts;

            createProducts()
                .then(function(products) {
                    createdProducts = products;
                    return Order.create({
                        purchasedItems: [],
                        shippingAddress: "the address",
                        shippingEmail: "email@emailcom"
                    });
                })
                .then(function(order) {
                    // check if quantities are lower
                    return Product.findOne({_id: createdProducts[0]._id});
                })
                .then(function(product1) {
                    expect(product1.quantity).to.equal(2);
                    return Product.findOne({_id: createdProducts[1]._id});
                })
                .then(function(product2) {
                    expect(product2.quantity).to.equal(0);
                    done();
                })
                .then(null, done);

        })
    });

});