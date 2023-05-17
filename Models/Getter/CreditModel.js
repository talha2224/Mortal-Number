const mongoose = require ('mongoose')

const CreditSchema  = mongoose.Schema({
    amount :{type:Number,required:true},
    approved:{type:Boolean,required:true,default:false},
    userProfileId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"UserInfo"
    }
})

const CreditRequest = mongoose.model('CreditRequest',CreditSchema,'CreditRequest')
module.exports = CreditRequest