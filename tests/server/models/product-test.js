var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var sinon = require('sinon');
var expect = require('chai').expect;
var mongoose = require('mongoose');

// Require in all models.
require('../../../server/db/models');

var Product = mongoose.model('Product');
var Category = mongoose.model('Category');

describe('Product model', function () {

    beforeEach('Establish DB connection', function (done) {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);
    });

    afterEach('Clear test database', function (done) {
        clearDB(done);
    });

    it('should exist', function () {
        expect(Product).to.be.a('function');
    });

        describe('on creation', function () {

            var testProduct = {
                      title: "Mu opzor hu.",
                      description: "Wu vo cut daz kirommiw monasawe tembu atoclu hauhu fu rasehlu puuka zo mebip ce hilbu lar sevjobbak gi jovonilet uhokva uhtod imumaizo pis todta cosin fi borunsi ce janhog.",
                      price: 900,
                      quantity: 3,
                      photoUrl: "http://api.randomuser.me/portraits/thumb/men/16.jpg",
                    };

            var testCategory = {name:"Test Boat"};

            var createProduct = function () {
                return Category.create(testCategory)
                .then(function(createdCategory){
                    testProduct.categories= createdCategory._id;
                    return Product.create(testProduct); 
                });
            };

            it('should set properties correctly when creating product', function (done) {
                createProduct().then(function (prod) {
                    expect(prod.title).to.be.equal(testProduct.title);
                    expect(prod.description).to.be.equal(testProduct.description);
                    expect(prod.price).to.be.equal(testProduct.price);
                    expect(prod.quantity).to.be.equal(testProduct.quantity);
                    expect(prod.photoUrl).to.be.equal(testProduct.photoUrl);
                    done();
                });
            });

            it('should set assign catagory correctly', function (done) {
                createProduct().then(function (prod) {
                    return Product.findOne({_id:prod._id})
                    .populate('categories');
                }).then(function(prod){
                    expect(prod.categories[0].name).to.be.equal(testCategory.name);
                    done();
                });
            });



        });


});
