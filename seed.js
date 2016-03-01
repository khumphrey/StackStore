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
var chance = require('chance')(123);

var seedUsers = function () {

    var users = [
        {
            email: 'testing@fsa.com',
            password: 'password'
        },
        {
            email: 'obama@gmail.com',
            password: 'potus'
        }
    ];

    return User.createAsync(users);

};


function randPhoto () {
    var g = chance.pick(['men', 'women']);
    var n = chance.natural({
        min: 0,
        max: 96
    });
    return 'http://api.randomuser.me/portraits/thumb/' + g + '/' + n + '.jpg';
}

function randWords (minWords, maxWords) {
    var numWords = chance.natural({
        min: minWords,
        max: maxWords
    });
    return chance.sentence({words: numWords});
}

var categories = ['motor boat', 'cruise ship', 'pirate ship'];

function randInteger (minNum, maxNum){
    return chance.integer({min: minNum, max: maxNum});
}

function randProduct (catId){
    return new Product({
        title: randWords(1,3),
        description: randWords(10,30),
        price: randInteger(400, 900),
        quantity: randInteger(0, 10),
        categories: [catId],
        photoUrl: randPhoto(),
        // this is photos of people for now
    });
}

function seedProdCat (numOfProducts){
    var productDocs = [],
        catIDs = [];

    var categoriesObj = categories.map(function(elem){
        return {name:elem};
    });
    return Category.createAsync(categoriesObj)
    .then(function(categoryDocs){
        catIDs = categoryDocs.map(elem => elem._id);
        for (var i = 0; i < numOfProducts; i++) {

            console.log(chance.pickone(catIDs));
            // TODO update this to allow for multiple catagories
            productDocs.push(randProduct(chance.pickone(catIDs)));
        }
        return productDocs;
    });
}

connectToDb.then(function () {
    Product.findAsync({})
    .then(function (product) {
        if (product.length === 0) {
            return Promise.map(seedProdCat(50), function (productDoc) {
                return productDoc.save();
            });
        } else {
            console.log(chalk.magenta('Seems to already be product data, exiting!'));
            process.kill(0);
        }
    }).then(function(){
        return User.findAsync({}).then(function (users) {
            if (users.length === 0) {
                return seedUsers();
            } else {
                console.log(chalk.magenta('Seems to already be user data, exiting!'));
                process.kill(0);
            }
        });
    }).then(function () {
        console.log(chalk.green('Seed successful!'));
        process.kill(0);
    }).catch(function (err) {
        console.error(err);
        process.kill(1);
    });
});
