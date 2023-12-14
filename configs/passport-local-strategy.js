const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcrypt')

//configure our local passport strategy
passport.use(new LocalStrategy({
        usernameField:"email",
        passReqToCallback:true 
    },
    async function(req,email,password,done){
        //check if the user exists
        let user = await User.findOne({email:email});

        //if the user is not found
        if(!user){
            req.flash('error', "User does not exist")
            return done(null,false)
        }
        //compare password using bcrypt
        let isValidPassword = await bcrypt.compare(password,user.password);
        if(!isValidPassword){
            req.flash('error', "Password does not match")
            return done(null,false)
        }
        //else
        return done(null,user)
    }
))

//serialize the user to store the id in the session cookie
passport.serializeUser(function(user,done){
    return done(null,user._id);
})

//deserialize the user to get the data of the user
passport.deserializeUser(async function(id,done){
    try{
        //find the user with the id
        let user = await User.findById(id);
        return done(null,user)
    }catch(err){
        if(err){
            console.log(`Error in deserializing the user : ${err}`)
            return done(err)
        }
    }
})

//check authentication for protected routes
passport.checkAuthentication = function(req,res,next){
    if(req.isAuthenticated()){
        next();
    }
    else{
        return res.redirect('/')
    }
}

//set the authenticated user details to locals
passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        res.locals.user = req.user
    }
    next();
}

//checks if the user is verified
passport.isVerified = async function(req,res,next){
    //find the user
    let user = await User.findById(req.user._id);
    if(user.isVerified){
        next();
    }
    else{
        return res.redirect('/authenticate')
    }
}

module.exports = passport;
