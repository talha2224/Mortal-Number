const { ErrorResponse } = require('../../Error/Utils')
const { RewardsModel } = require('../../Models')

const getRewards = async(id)=>{
    let getRewards = await RewardsModel.find({
        $or: [
          { getterId:id },
          { setterId: id },
        ]
      }).populate("getterId" ,"-accountMuted -accountBlocked -OTP -otpValidTill -otpVerified -phonenumber")
        .populate("setterId","-accountMuted -accountBlocked -OTP -otpValidTill -otpVerified -phonenumber")
        .populate("setterId"," _id firstName lastName username profileImage")
      .populate("gameId","_id stake prize ")
      .populate("lostBy","_id firstName lastName username profileImage`")
      if (getRewards.length<=0){
        throw new ErrorResponse ('No Rewards Found For This User',404)
      }
      return getRewards
}


module.exports = {getRewards}