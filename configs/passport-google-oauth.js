require('dotenv')
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../models/user');
const crypto = require('crypto');

//configure the google Strategy
passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret:process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:process.env.GOOGLE_CALLBACK
    },async function(accessToken,refreshToken, profile,done){
        //check if the user is available in our local db
        let user = await User.findOne({email:profile.emails[0].value});
        //if the user exists
        if(user){
            return done(null,user);
        }
        // if the user does not already exist
        else{
            //create the user from google into our local db
            let createdUser  = await User.create({
                email:profile.emails[0].value,
                password: crypto.randomBytes(30).toString('hex'),
                name:profile.displayName,
                isVerified:true //since the user is being created from google only, we are setting isverified field to true
            })
            return done(null,createdUser)
        }

    }
))

module.exports = passport;