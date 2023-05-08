const { ErrorResponse } = require("../../Error/Utils");
const { RewardsModel } = require("../../Models");

// const postReward = async(amount,won,getterId,setterId) =>{
//     try {
//         let reward = await RewardsModel.create({amount:amount,won:won,getterProfileId:getterId,setterProfileId:setterId})
//         if(reward){
//             return reward
//         }
//         else{
//             throw new ErrorResponse("failed to post data check your code",409)
//         }
//     }
//     catch (error) {
//         throw new ErrorResponse(error.message,409)
//     }
// }

const getReward = async (id) => {
  let reward = await RewardsModel.find({
    $or: [{ getterProfileId: id }, { setterProfileId: id }],
  })
    .populate("getterProfileId" ,"-accountMuted -accountBlocked -OTP -otpValidTill -otpVerified -phonenumber")
    .populate("setterProfileId","-accountMuted -accountBlocked -OTP -otpValidTill -otpVerified -phonenumber")
    .populate("postedBy"," _id firstName lastName username profileImage")
    .populate("gameId","_id stake prize ")
  if (reward.length > 0) {
    return reward;
  } else {
    throw new ErrorResponse("no reward found for this user", 404);
  }
};

const deleteReward = async (id) => {
  let reward = await RewardsModel.findByIdAndDelete(id);
  if (reward) {
    return { msg: "reward deleted sucesffuly" };
  } else {
    throw new ErrorResponse(
      "no reward found for this id failed to delete",
      404
    );
  }
};
module.exports = { getReward, deleteReward };
