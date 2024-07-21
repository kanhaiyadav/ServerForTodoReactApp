const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;

//this library is used to generate random bytes(for the password of the user)
const crypto = require('crypto');

const User = require('../model/users_model.js');
require('dotenv').config();

passport.use(new googleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async function (accessToken, refreshToken, profile, done) {
    try {
        let user = await User.findOne({ email: profile.emails[0].value });
        console.log(profile);
        
        if (user) {
            return done(null, user);
        } else {
            user = await User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: crypto.randomBytes(20).toString('hex'),
                avatar: profile.photos[0].value
            });
            return done(null, user);
        }
    } catch (err) {
        console.log('error', err);
        return done(err);
    }

}));
