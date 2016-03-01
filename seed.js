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
var Catagory = Promise.promisifyAll(mongoose.model('Catagory'));
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

var catagories = ['motor boat', 'cruise ship', 'pirate ship'];

function seedCatagories (){
    var catagoriesObj = catagories.map(function(elem){
        return {name:elem};
    });
    return Catagory.createAsync(catagoriesObj);
}

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
    return chance.sentence({words: numWords})
    .replace(/\b\w/g, function (m) {
        return m.toUpperCase();
    })
    .slice(0, -1);
}

function randNumber (minNum, maxNum){
    chance.natural({min: 0, max: maxNum});
}


function randProduct (){
    return new Product({
        title: randWords(1,3),
        description: randWords(10,30),
        price: randNumber(100000, 10000000),
        quantity: randNumber(0,10),
        catagory: chance.pickone(catagories),
        photoUrl: randPhoto(),
        // this is of people for now
    });
}

connectToDb.then(function () {
    User.findAsync({}).then(function (users) {
        if (users.length === 0) {
            return seedUsers();
        } else {
            console.log(chalk.magenta('Seems to already be user data, exiting!'));
            process.kill(0);
        }
    }).then(function () {
        console.log(chalk.green('Seed successful!'));
        process.kill(0);
    }).catch(function (err) {
        console.error(err);
        process.kill(1);
    });
});
