//importing mongoose module
const mongoose = require('mongoose');
require('dotenv')
// setting up connection to our mongoose
// mongoose.connect("mongodb://127.0.0.1:27017/NodeAuthenticationDb");
mongoose.connect(process.env.MONGODB_URL);

const db = mongoose.connection;

//if there is any error in connecting to database
db.on('error',console.error.bind(console,'error in connection to DB'))

//if the connection to db is open
db.once('open',function(){
    console.log(`Connection to MongoDb successfull!!`);
})

module.exports = db;