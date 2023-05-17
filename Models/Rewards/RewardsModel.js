const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema({
  title:{
    type:String,
    default:null
  },
  amount: {
    type: Number,
  },
  getterwon: {
    type: Boolean,
    default: false,
  },
  setterwon: {
    type: Boolean,
    default: false,
  },
  notificationFor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserInfo",
    default: null,
  },
  notificationBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserInfo",
    default: null,
  },
  gameId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Game",
    default: null,
  },
  lostBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserInfo",
    default: null,
  }
},{timestamps:true});

const Rewards = new mongoose.model("Rewards", notificationSchema, "Rewards");

module.exports = Rewards;
