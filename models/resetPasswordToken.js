const mongoose = require('mongoose');

const resetPasswordTokenSchema =  new mongoose.Schema({
    accessToken:{
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

module.exports = mongoose.model('resetPasswordToken',resetPasswordTokenSchema);
