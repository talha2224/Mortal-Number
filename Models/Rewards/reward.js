const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema({
  amount: {
    type: Number,
  },
  won:{
    type:Boolean,
    default:false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserInfo",
    default: null,
  },
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserInfo",
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