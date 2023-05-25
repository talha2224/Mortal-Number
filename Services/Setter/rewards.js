const { ErrorResponse } = require('../../Error/Utils')
const { RewardsModel } = require('../../Models')

const getRewards = async(id)=>{
    let getRewards = await RewardsModel.find({setterId:id,role:"setter",}).populate("guesserId" ,"-accountMuted -accountBlocked -OTP -otpValidTill -otpVerified -phonenumber")
        .populate("setterId","-accountMuted -accountBlocked -OTP -otpValidTill -otpVerified -phonenumber")
        .populate("gameId","_id stake prize ")
    if (getRewards.length<=0){
        throw new ErrorResponse ('No Rewards Found For This User',404)
    }
    return getRewards
}

module.exports = {getRewards}