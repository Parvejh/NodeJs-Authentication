const User = require('../models/user')
const isValidUser = require('../models/isValidUser')
const resetPasswordToken =  require('../models/resetPasswordToken')
const userMailer = require('../mailers/user_mailer')
const crypto = require('crypto')
const bcrypt = require('bcrypt');
const saleRounds = 2;

//action to display the sign in page
module.exports.signIn = function(req,res){
    //go  to profile if the user is already authenticated
    if(req.isAuthenticated()){
        return res.redirect('/profile')
    }
    //else go to the sign in page
    return res.render('user_sign_in', {
        title:"User Sign In"
    })
}

//action to display the sign up page
module.exports.signUp = function(req,res){
    //go  to profile if the user is already authenticated
    if(req.isAuthenticated()){
        return res.redirect('/profile')
    }
    //else go to the sign up page
    return res.render('user_sign_up', {
        title:"User Sign up"
    })
}

//action to create a new user
module.exports.create = async function(req,res){
    try{
        //if the password & confirm password does not match
        if(req.body.password !== req.body.confirmPassword){
            req.flash('error',"Password & Confirm password does not match")
            return res.redirect("back")
        }
        //find the user 
        let user = await User.findOne({email:req.body.email});
        //if the user already exist
        if(user){
            req.flash('error',`${user.email} already exists`)
            return res.redirect('/');
        }
        //if the user does not exist
        else{
            //encrypt the password by using bcrypt
            let hashPassword = await bcrypt.hash(req.body.password,saleRounds)
            //create the new user
            let createdUser = await User.create({
                name:req.body.name,
                email:req.body.email,
                dob:req.body.dob,
                password:hashPassword
            })
            //send the verification link to the user email add
            //create a isValidUserToken entry first & send it in the email
            const token = await isValidUser.create({
                token: crypto.randomBytes(20).toString('hex'),  //this generate a random string to be used as token
                user : createdUser._id
                //isValid is true by default.
            })
            //send this token as a link to the new user
            userMailer.authenticateUser(token);
            req.flash('success',`${createdUser.email} user created`)
            return res.redirect('/')
        }
    }catch(err){
        if(err){
            console.log(`Error in creating the user :  ${err}`);
            return res.redirect('back')
        }
    }
}

//action to authenticate the user
module.exports.authenticateUser = async function(req,res){
    //the token id is passed in the params
    //find the token
    let token = await isValidUser.findById(req.params.id);
    //if token does not exist
    if(!token){
        req.flash('error',"Token does not exist")
        return res.redirect('/');
    }
    //find the user for the token & update isvalid to true for the user
    if(token.isValid==true){
        //update the is valid for user
        let user = await User.findByIdAndUpdate(token.user,{isVerified:true});
        //update the isvalid to false for valid user token
        await isValidUser.findByIdAndDelete(req.params.id);
        return res.redirect('/profile');
    }else{
        req.flash('error',"Token Expired")
        return res.redirect('/')
    }
}

//action to display the authenticate user page
module.exports.authenticatePage = function(req,res){
    //go to the profile page if the user already is verified
    if(req.user.isVerified==true){
        return res.redirect('/profile')
    }
    //else display the authenticate user page
    return res.render("authenticate_user",{
        title:"Authentication Page"
    })
}

//action to create session & login for user
module.exports.login = async function(req,res){
    req.flash('success',"User logged In!")
    return res.redirect('/profile')
}

//action to display the profile page
module.exports.profile = function(req,res){
    return res.render('user_profile',{
        title:"Profile"
    })
}

//action to destroy the session & logout the user
module.exports.logout = function(req,res){
    req.logout((err)=>{
        if(err){
            console.log(`Error in logging out : ${err}`)
            return
        }
    })
    req.flash('error','User logged out!')
    return res.redirect('/')
}

//action to display the reset password page
module.exports.resetPwdPage = function(req,res){
    return res.render('user_reset_pass',{
        title:"Reset Password"
    })
}

//action to reset the password for the user
module.exports.resetPassword = async function(req,res){

    //get the user from the req.body
    let user = await User.findOne({email:req.body.email});
    //check if the new password & confirm password matches
    if(req.body.password !== req.body.confirmPassword){
        req.flash('error',"New Password & Confirm Password does not match")
        return res.redirect('/')
    }
    //reset the password 
    //generate a new hashed password
    const hashPassword = await bcrypt.hash(req.body.password,saleRounds)
    //find and update the user password with the new password
    await User.findByIdAndUpdate(user._id ,{password:hashPassword})
    req.flash('success',"Password Updated")

    return res.redirect('/');
}

//action to display forget password page
module.exports.forgetDisplay = function(req,res){
    return res.render("forget_pass",{title:"Forget Password"})
}

//action to create & send a forget password link to user email id
module.exports.forgetLink = async function(req,res){
    //search if the user exist with this email id
    let user = await User.findOne({email:req.body.email});

    //if the user is not found
    if(!user){
        req.flash("error","Invalid email id.")
        return res.redirect('/')
    }else{
        //if the user is found
        //check if the user is not verified
        if(!user.isVerified){
            req.flash('error',"User is not verified.");
            return res.redirect('/')
        }
        //if the user is verified , create a resetPaswordToken & send it to the user
        let token = await resetPasswordToken.create({
            accessToken: crypto.randomBytes(30).toString('hex'),
            user:user._id
        })

        //send the token in the mail
        userMailer.forgetUser(token);
        req.flash('success',"Reset link sent");
        return res.redirect('/')
    }
}

//action to reset password by forget password route
module.exports.resetForgetPassword = async function(req,res){
    //get the token from the params
    let token = await resetPasswordToken.findById(req.params.tokenid);
    let user = await User.findById(token.user)
    // console.log('TOKEN' , token , "USER" , user)
    //if token does not exist or the token is not valid
    if(!token || !token.isValid){
        req.flash('error','Token has expired');
        return res.redirect('/');
    }
    //if the token exist & is valid, then display reset_password page
    
    //destroy the token
    await resetPasswordToken.deleteOne({_id:token._id});
    return res.render('user_reset_pass',{title:"Reset Password", user:user});
}