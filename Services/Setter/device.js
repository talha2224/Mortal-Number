const { DeviceTokenSchema } = require("../../Models");

const postDeviceToken = async(deviceToken,device,setterId)=>{
    let findToken = await DeviceTokenSchema.findOne({setterId:setterId,role:"setter"})
    if(findToken){
        let updateDeviceToken = await DeviceTokenSchema.findOneAndUpdate({setterId:setterId},{$set:{
            setterId:setterId,
            device:device,
            deviceToken:deviceToken,
            role:"setter"
        }},{new:true})
        if (updateDeviceToken){
            return updateDeviceToken
        }
    }
    let createToken = await DeviceTokenSchema.create({setterId:setterId,device:device,deviceToken:deviceToken,role:"setter"})
    if(createToken){
        return createToken
    }
}

module.exports = {postDeviceToken}