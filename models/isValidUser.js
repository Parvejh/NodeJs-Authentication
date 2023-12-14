const mongoose = require('mongoose');

const validUserTokenSchema =  new mongoose.Schema({
    token:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    isValid:{
        type:Boolean,
        default:true
    }
},{
    timestamps:true
})

module.exports = mongoose.model('validUserToken',validUserTokenSchema);
