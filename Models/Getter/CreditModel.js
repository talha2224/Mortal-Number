const mongoose = require ('mongoose')

const CreditSchema  = mongoose.Schema({
    amount :{type:Number,required:true},
    approved:{type:Boolean,required:true,default:false},
    getterId:{
        type:mongoose.Types.ObjectId,
        ref:"GetterInfo",
        default:null
    },
    setterId:{
        type:mongoose.Types.ObjectId,
        ref:"SetterInfo",
        default:null
    }
})

const CreditRequest = mongoose.model('CreditRequest',CreditSchema,'CreditRequest')
module.exports = CreditRequest