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
    }
    
})

const SetterInfo = mongoose.model('SetterInfo',RegisterModel,'SetterInfo')

module.exports = SetterInfo