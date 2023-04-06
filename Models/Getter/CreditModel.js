const mongoose = require ('mongoose')

const CreditSchema  = mongoose.Schema({
    amount :{type:Number,required:true},
    approved:{type:Boolean,required:true,default:false},
    getterProfileId:{
        type:mongoose.Types.ObjectId,
        ref:"GetterProfile",
        default:null
    },
    setterProfileId:{
        type:mongoose.Types.ObjectId,
        ref:"SetterProfile",
        default:null
    }
})

const CreditRequest = mongoose.model('CreditRequest',CreditSchema,'CreditRequest')
module.exports = CreditRequest