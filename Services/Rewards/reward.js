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
//}
// const getReward = async (id) => {
//   let reward = await RewardsModel.find({
//     $or: [{ getterProfileId: id }, { setterProfileId: id }],
//   })
//     .populate("getterProfileId" ,"-accountMuted -accountBlocked -OTP -otpValidTill -otpVerified -phonenumber")
//     .populate("setterProfileId","-accountMuted -accountBlocked -OTP -otpValidTill -otpVerified -phonenumber")
//     .populate("postedBy"," _id firstName lastName username profileImage")
//     .populate("gameId","_id stake prize ")
//     .populate("lostBy","_id firstName lastName username profileImage`")
//   if (reward.length > 0) {
//     return reward;
//   } else {
//     throw new ErrorResponse("no reward found for this user", 404);
//   }
// };
const getReward = async (id)=>{
  let getRewards = await RewardsModel.find({
    $or: [
      { notificationFor:id },
      { notificationBy: id },
      { title: 'New Game Posted' },
      {lostBy:id},
      {getterwon:true}
    ]
  })
  if (getRewards.length<=0){
    throw new ErrorResponse ('No Notification Found For This User',404)
  }
  // const filterData= getRewards.filter((item)=>{
  //   if ((item.notificationFor.toString() && item.notificationFor.toString()  === id) ||(item.notificationBy.toString()  && item.notificationBy.toString()  ===id)) {
  //     return true;
  //   }
  //   if (item.title === 'New Game Posted') {
  //     return true;
  //   }
  //   return false;
  // })
  return getRewards
}

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
