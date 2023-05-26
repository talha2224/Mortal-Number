
const mongoose = require("mongoose")

const deviceSchema = new mongoose.Schema({
    
    role:{type:String,required:true},
    deviceToken:{type:String,required:true},
    device:{type:String,default:null},
    guesserId:{type:mongoose.Schema.Types.ObjectId,ref:"GetterInfo",default:null},
    setterId:{type:mongoose.Schema.Types.ObjectId,ref:"SetterInfo",default:null}

})

const DeviceToken = mongoose.model("DeviceToken",deviceSchema,"DeviceToken")

module.exports = DeviceToken