const nodemailer = require('../configs/nodemailer')
const isValidUser = require('../models/isValidUser');
const resetPasswordToken = require('../models/resetPasswordToken');

//method to sent authenticate user link
exports.authenticateUser = async function(data){
    //find the token & populate its user
    let token = await isValidUser.findById(data._id).populate('user')
    //pass the token to mailer ejs file
    let htmlString = nodemailer.renderTemplate({token:token},'/authenticateUser.ejs');
    nodemailer.transporter.sendMail({
        from:"nodeAuthenticate@no-reply.com",
        to:token.user.email,
        subject:"Authenticate User Id",
        html:htmlString
    },function(err,info){
        if(err){
            console.log("error in user_mailer.js");
            return;
        }
        return;
    })   
}

//method to sent forget password link
exports.forgetUser = async function(data){
    //find the token & populate its user
    let token = await resetPasswordToken.findById(data._id).populate('user')
    //pass the token to mailer ejs file
    // console.log("Token sent in forgetUser :",token)
    let htmlString = nodemailer.renderTemplate({token:token},'/forgetPassword.ejs');
    nodemailer.transporter.sendMail({
        from:"nodeAuthenticate@no-reply.com",
        to:token.user.email,
        subject:"Forget User Password",
        html:htmlString
    },function(err,info){
        if(err){
            console.log("error in user_mailer.js");
            return;
        }
        return;
    })   
}
