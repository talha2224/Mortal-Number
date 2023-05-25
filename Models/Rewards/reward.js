const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema({
  role:{
    type:String,
    default:null
  },
  amount: {
    type: Number,
  },
  won:{
    type:Boolean,
    default:false
  },
  guesserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GetterInfo",
    default: null,
  },
  setterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SetterInfo",
    default: null,
  },
  gameId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Game",
    default: null,
  }
},{timestamps:true});

const Rewards = new mongoose.model("Rewards", notificationSchema, "Rewards");

module.exports = Rewards;