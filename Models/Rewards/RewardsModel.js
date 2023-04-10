const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({

    amount:{
        type:Number,
        required:true
    },
    won:{
        type:Boolean,
        default:false
    },
    lost:{
        type:Boolean,
        default:false
    },
    getterProfileId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"GetterProfile",
        default:null
    },
    setterProfileId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"SetterProfile",
        default:null
    }
})


const Rewards = new mongoose.model('Rewards',notificationSchema,'Rewards')

module.exports = Rewards