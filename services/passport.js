const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
  console.log(user)
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log(id)
  User.findById(id)
    .then(user => {
      done(null, user);
    })
});

passport.use(new GoogleStrategy({
  clientID: keys.googleClientID,
  clientSecret: keys.googleClientSecret,
  callbackURL: '/auth/google/callback',
  proxy: true,
}, (accessToken, refreshToken, profile, done) => {
  User.findOne({ googleId: profile.id })
    .then((existingUser) => {
      if (existingUser) {
        // already have a record with given profile id
        console.log('already exists a user');
        done(null, existingUser);
      } else {
        console.log('going to create new user');
        new User({ googleId: profile.id })
        .save()
        .then(user => done(null, user))
        .catch(err => console.log(err));
      }
    })
    .catch(err => console.log(err));
})
);
