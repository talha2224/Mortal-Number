const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema({
  role:{type:String},
  title:{type:String},
  won:{
    type:Boolean,
    default:null
  },
  amount: {
    type: Number,
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
  },

},{timestamps:true});

const Notfication = new mongoose.model("Notfication", notificationSchema, "Notfication");

module.exports = Notfication;
