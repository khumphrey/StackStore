module.exports = {
  "DATABASE_URI": "mongodb://localhost:27017/fsg-app",
  "SESSION_SECRET": "Optimus Prime is my real dad",
  "TWITTER": {
    "consumerKey": "GQNYCZ44nkPfLRos1zh3wmd14",
    "consumerSecret": "6Xg2ICsqgHxCffEoWAvScBUroJhBgsAAWaCwieXM7S1aVzeQeZ",
    "callbackUrl": "http://127.0.0.1:8080/auth/twitter/callback"
  },
  "FACEBOOK": {
    "clientID": "591275987704682",
    "clientSecret": "26a3caaaf6d510d0448f51efe2417430",
    "callbackURL": "http://localhost:1337/auth/facebook/callback"
  },
  "GOOGLE": {
    "clientID": "904557065956-n0beojtbnuvk707l1nku6gm82vuib4n1.apps.googleusercontent.com",
    "clientSecret": "oveeJO7ygdXDPnFhZROm-8MU",
    "callbackURL": "http://127.0.0.1:8080/auth/google/callback"
  }
};