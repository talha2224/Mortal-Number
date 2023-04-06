const mongoose = require('mongoose');

const GameSchema = mongoose.Schema({
    setterId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'SetterProfile'
    },
    winningNumber :{
        type:Array,
        required:true
    },
    stake:{
        type:Number,
        required:true
    },
    prize:{
        type:Number,
        required:true
    },
    duration:{
        hours:{type:Number,default:0},
        min:{type:Number,default:0},
        sec:{type:Number,default:0}
    },
    active:{
        type:Boolean,
        default:true
    },
    winBy:{
        type:Array,
        default:null
    }

})

const Game = mongoose.model('Game',GameSchema,'Game')

module.exports = Game