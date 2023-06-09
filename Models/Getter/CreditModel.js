const mongoose = require ('mongoose')

const CreditSchema  = mongoose.Schema({
    role:{type:String,default:"guesser"},
    amount :{type:Number,required:true},
    approved:{type:Boolean,required:true,default:false},
    
    guesserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"GetterInfo",
        default:null
    },
    setterId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"SetterInfo",
        default:null
    }
})

const CreditRequest = mongoose.model('CreditRequest',CreditSchema,'CreditRequest')
module.exports = CreditRequest