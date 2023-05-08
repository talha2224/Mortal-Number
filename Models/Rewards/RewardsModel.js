const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  won: {
    type: Boolean,
    default: false,
  },
  getterProfileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GetterInfo",
    default: null,
  },
  setterProfileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SetterInfo",
    default: null,
  },
});

const Rewards = new mongoose.model("Rewards", notificationSchema, "Rewards");

module.exports = Rewards;
