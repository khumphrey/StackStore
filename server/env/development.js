var secrets = require('../../secrets.json');

module.exports = {
  "DATABASE_URI": secrets.databaseURI,
  "SESSION_SECRET": secrets.session,
  "TWITTER": {
    "consumerKey": "JiW54zW8HuOT2dR1Q6UQEytYT",
    "consumerSecret": secrets.twitterSecret,
    "callbackUrl": "http://127.0.0.1:1337/auth/twitter/callback"
  },
  "FACEBOOK": {
    "clientID": "1044357222287848",
    "clientSecret": secrets.facebookSecret,
    "callbackURL": "http://localhost:1337/auth/facebook/callback"
  },
  "GOOGLE": {
    "clientID": "904557065956-eron9mfn30ggt96v7rvq6rsbgmolqhm5.apps.googleusercontent.com",
    "clientSecret": secrets.googleSecret,
    "callbackURL": "http://127.0.0.1:1337/auth/google/callback"
  }
};