require('dotenv')
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

//setting transporter for our nodemailer
const transporter = nodemailer.createTransport({
    service:'gmail',
    host:'smtp.gmail.com',
    port:587,
    secure:false,
    auth:{
        user:process.env.NODEMAILER_AUTH_ID,
        pass:process.env.NODEMAILER_AUTH_PASS
    }
})

//setting our renderTemplate for the nodemailer
const renderTemplate = function(data,relativePath){
    let mailHTML ; 
    ejs.renderFile(
        path.join(__dirname,'../views/mailers',relativePath),
        data,
        function(err,template){
            if(err){
                console.log(err);
                return;
            }
            mailHTML = template;
        }
    )
    return mailHTML;
}

module.exports = {transporter:transporter, renderTemplate:renderTemplate}