const mongoose = require ('mongoose')

const RegisterModel = mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    credit:{
        type:Number,
        required:true
    }
})

const GetterInfo = mongoose.model('GetterInfo',RegisterModel,'GetterInfo')

module.exports = GetterInfo