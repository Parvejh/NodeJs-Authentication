const express = require('express');
require('dotenv').config(); //require & config the dot env module
const port = process.env.PORT || 8000;
const app = express();
const path = require('path')
const expressLayout = require('express-ejs-layouts');
const session = require('express-session');
const { urlencoded } = require('body-parser');
// const cookieParser = require('cookie-parser');
const db = require('./configs/mongoose')
const passport = require('passport');
const passportLocal = require('./configs/passport-local-strategy')
const passportGoogle = require('./configs/passport-google-oauth')
const flash = require('connect-flash');
const customMiddleware = require('./configs/middleware');
const connectMongo = require('connect-mongo')
app.use(urlencoded({extended:true}));

//set the path for static files
app.use(express.static(path.join(__dirname,'./assets')))
//set the view engine as ejs
app.set('view engine','ejs');
app.set('views', path.join(__dirname,'./views'))

//use expressLayouts
app.use(expressLayout);

//set the extracts to true
app.set('layout extractStyles',true)
app.set('layout extractScripts',true)

//configuring the session
app.use(session({
    name:"Authenticate",
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{maxAge:100000*60*10},
}))

//initialize the passport & passport session
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser)

app.use(flash());
app.use(customMiddleware.setFlash)

//home route
app.use('/',require('./routes'))

app.listen(port ,(err)=>{
    if(err){
        console.log(`Error in starting the server :  ${err}`);
        return
    }
    console.log(`Server is Up & Running on port : ${port}`);
})