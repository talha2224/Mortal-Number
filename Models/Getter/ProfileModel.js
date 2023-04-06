const mongoose = require('mongoose');

const ProfileSchema = mongoose.Schema({
    accountId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"GetterInfo",
    },

    username:{
        type:String,
        required:true
    },

    useremail:{
        type:String,
        required:true
    },

    phonenumber:{
        type:String,
        required:true
    },

    credit:{
        type:Number
    },

    dateOfBirth:{
        type:String,required:true
    },

    gender:{
        type:String,
        required:true
    },

    country:{
        type:String,
        required:true
    },

    profileImage:{
        type:String,
        required:true
    }
})

const GetterProfile = mongoose.model('GetterProfile',ProfileSchema,'GetterProfile')

module.exports = GetterProfile