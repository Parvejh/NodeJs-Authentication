const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller');
const passport = require('passport');
const user = require('../models/user');

router.get('/', userController.signIn);

router.get('/signUp', userController.signUp)

router.post('/createUser', userController.create)

router.post('/login' , passport.authenticate('local',{failureRedirect:'/'}),userController.login);

router.get('/profile',passport.checkAuthentication ,passport.isVerified, userController.profile)

router.get('/logout',passport.checkAuthentication, userController.logout)

router.get('/resetPassword', passport.checkAuthentication,passport.isVerified, userController.resetPwdPage)

router.post('/resetPassword', userController.resetPassword)

router.get('/authenticate',passport.checkAuthentication,userController.authenticatePage);

router.get('/authenticateUser/:id',userController.authenticateUser)

router.get('/forgetPassword', userController.forgetDisplay);

router.post('/forgetPassword',userController.forgetLink)

router.get('/resetPassword/:tokenid',userController.resetForgetPassword)

//routes for google authentication
router.get('/auth/google', passport.authenticate('google',{scope:['email','profile']}));
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/'}),userController.login);

module.exports = router;