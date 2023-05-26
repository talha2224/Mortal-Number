const { ErrorResponse } = require("../../Error/Utils");
const { DeviceTokenSchema } = require("../../Models");

const postDeviceToken = async(deviceToken,device,guesserId)=>{
    let findToken = await DeviceTokenSchema.findOne({guesserId:guesserId,role:"guesser"})
    if(findToken){
        let updateDeviceToken = await DeviceTokenSchema.findOneAndUpdate({guesserId:guesserId},{$set:{
            guesserId:guesserId,
            device:device,
            deviceToken:deviceToken,
            role:"guesser"
        }},{new:true})
        if (updateDeviceToken){
            return updateDeviceToken
        }
    }
    let createToken = await DeviceTokenSchema.create({guesserId:guesserId,device:device,deviceToken:deviceToken,role:"guesser"})
    if(createToken){
        return createToken
    }
}

module.exports = {postDeviceToken}