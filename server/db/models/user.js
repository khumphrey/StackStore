'use strict';
var crypto = require('crypto');
var mongoose = require('mongoose');
var _ = require('lodash');

var schema = new mongoose.Schema({
    username: {
        type: String,
    },
    fullname: {
        type: String
    },
    cart: [{ 
        product: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Product'
        }, 
        quantity: {type:Number, min:1, default:1}
    }],
    history: [{type: mongoose.Schema.Types.ObjectId, ref: 'Order'}],
    email: {
        type: String,
        required: true,
        unique: true
    },
    admin: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String
    },
    twitter: {
        id: String,
        username: String,
        token: String,
        tokenSecret: String
    },
    facebook: {
        id: String
    },
    google: {
        id: String
    }
});

schema.methods.addOrModify = function (item) {
    var notAdded = true;
    for(var i=0; i<this.cart.length; i++) {
        if(this.cart[i].product.toString() === item.product){
            this.cart[i].quantity += item.quantity;
            notAdded = false;
            break;
        }
    }
    if(notAdded) this.cart.push(item);
};

// method to remove sensitive information from user objects before sending them out
schema.methods.sanitize = function () {
    return _.omit(this.toJSON(), ['password', 'salt', 'twitter', 'facebook', 'google']);
};

// generateSalt, encryptPassword and the pre 'save' and 'correctPassword' operations
// are all used for local authentication security.
var generateSalt = function () {
    return crypto.randomBytes(16).toString('base64');
};

var encryptPassword = function (plainText, salt) {
    var hash = crypto.createHash('sha1');
    hash.update(plainText);
    hash.update(salt);
    return hash.digest('hex');
};

    
schema.pre('save', function (next) {
    if (!this.username) {
        this.username = this.email;
    }

    if (this.isModified('password')) {
        this.salt = this.constructor.generateSalt();
        this.password = this.constructor.encryptPassword(this.password, this.salt);
    }

    next();

});

schema.statics.generateSalt = generateSalt;
schema.statics.encryptPassword = encryptPassword;

schema.method('correctPassword', function (candidatePassword) {
    return encryptPassword(candidatePassword, this.salt) === this.password;
});

mongoose.model('User', schema);