const mongoose = require ('mongoose')

const CreditSchema  = mongoose.Schema({
    amount :{type:Number,required:true},
    approved:{type:Boolean,required:true,default:false},
    getterProfileId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"GetterInfo",
        default:null
    },
    setterProfileId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"SetterInfo",
        default:null
    }
})

const CreditRequest = mongoose.model('CreditRequest',CreditSchema,'CreditRequest')
module.exports = CreditRequest