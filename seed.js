/*

This seed file is only a placeholder. It should be expanded and altered
to fit the development of your application.

It uses the same file the server uses to establish
the database connection:
--- server/db/index.js

The name of the database used is set in your environment files:
--- server/env/*

This seed file has a safety check to see if you already have users
in the database. If you are developing multiple applications with the
fsg scaffolding, keep in mind that fsg always uses the same database
name in the environment files.

*/

var mongoose = require('mongoose');
var Promise = require('bluebird');
var chalk = require('chalk');
var connectToDb = require('./server/db');
var User = Promise.promisifyAll(mongoose.model('User'));
var Product = Promise.promisifyAll(mongoose.model('Product'));
var Category = Promise.promisifyAll(mongoose.model('Category'));
var Review = Promise.promisifyAll(mongoose.model('Review'));

var Order = Promise.promisifyAll(mongoose.model('Order'));
var chance = require('chance')(123);
var _ = require('lodash');

var boatData = require('./boat-data/all_boats.json');

var seedUsers = function() {

    var users = [{
        email: 'testing@fsa.com',
        password: 'password'
    }, {
        email: 'obama@gmail.com',
        fullname: "Barack Hussein Obama II",
        password: 'potus',
        admin: true
    }];

    _.times(30, function() {
        users.push({
           email: chance.email(),
           password: chance.string({length: 10}),
           fullname: chance.name(),
           admin: chance.bool({likelihood: 5}) 
        });
    })

    return User.createAsync(users);

};


function randPhoto() {
    var n = chance.natural({
        min: 0,
        max: 20
    });
    return 'https://s3.amazonaws.com/the-dock/images/boatImg' + n + '.jpg';
}

function randWords(minWords, maxWords) {
    var numWords = chance.natural({
        min: minWords,
        max: maxWords
    });
    return chance.sentence({ words: numWords });
}

var categories = ['motor boat', 'cruise ship', 'pirate ship', 'party boat'];

function randInteger(minNum, maxNum) {
    return chance.integer({ min: minNum, max: maxNum });
}




function randProduct(catId) {
    var boat = boatData.pop();
    return new Product({
        title: boat.title,
        description: randWords(10, 30),
        price: randInteger(400, 900),
        quantity: randInteger(60, 80),
        categories: [catId],
        photoUrl: boat.photoUrl
        // this is photos of people for now
    });
}

var products;
var users;

function createReview (user, product) {
    return Review.create({
        user: user,
        product: product,
        content: randWords(5,10),
        starRating: 4
    });
}

const clearDb = function() {
    console.log("clearing database");
    return Promise.map(['User', 'Product', 'Category', 'Order'], function(modelName) {
        return mongoose.model(modelName).remove();
    });
};

function seedProdCat(numOfProducts) {
    var productDocs = [],
        catIDs = [];

    var categoriesObj = categories.map(function(elem) {
        return { name: elem };
    });
    return Category.createAsync(categoriesObj)
        .then(function(categoryDocs) {
            catIDs = categoryDocs.map(elem => elem._id);
            for (var i = 0; i < numOfProducts; i++) {

                console.log(chance.pickone(catIDs));
                // TODO update this to allow for multiple catagories
                productDocs.push(randProduct(chance.pickone(catIDs)));
            }
            return productDocs;
        });
}

var users;
var products;

connectToDb.then(function() {
    clearDb()
        .then(function() {
            return Product.findAsync({});
        })
        .then(function(product) {
            return Promise.map(seedProdCat(boatData.length), function(productDoc) {
                return productDoc.save();
            });
        }).then(function(products) {
            createdProducts = products;
            return User.findAsync({}).then(function(users) {
                return seedUsers();
            });
        })
        .then(function() {
            return User.find({});
        })
        .then(function(createdUsers) {
            users = createdUsers;
            return Product.find({});
        })
        .then(function(createdProducts) {
            products = createdProducts;


            var newOrders = [];
            _.times(10, function() {

                var purchasedItems = [];
                _.times(3, function() {
                    var purchasedItem = {
                        product: chance.pickone(products),
                        quantity: chance.integer({ min: 1, max: 3 })
                    };
                    purchasedItems.push(purchasedItem);
                });

                var newOrder = {
                    purchasedItems: purchasedItems,
                    user: chance.pickone(users),
                    orderStatus: chance.pickone(['Created', 'Processing', 'Completed', 'Cancelled']),
                    streetAddress: chance.address(),
                    city: chance.address(),
                    state: 'NY',
                    zipCode: 88888,
                    shippingEmail: chance.email()
                };
                newOrders.push(newOrder);
            });

            return Promise.map(newOrders, function(newOrder) {
                return Order.create(newOrder);
            });

        })
        .then(function () {
            var reviewPromises = [
                createReview(users[0], products[0]),
                createReview(users[0], products[1]),
                createReview(users[0], products[2]),
                createReview(users[1], products[0]),
                createReview(users[1], products[1]),
                createReview(users[1], products[2]),
            ];
            return Promise.all(reviewPromises);
        })
        .then(function () {
            console.log(chalk.green('Seed successful!'));
            process.kill(0);
        }).catch(function (err) {
            console.error(err);
            process.kill(1);
        });
});
