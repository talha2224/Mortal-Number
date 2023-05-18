const { ErrorResponse } = require("../../Error/Utils");
const { NotificationModel } = require("../../Models");

const getReward = async (id)=>{
  let getNotificatio = await NotificationModel.find({
    $or: [
      { notificationFor:id },
      { notificationBy: id },
      { title: 'New Game Posted' },
      {lostBy:id},
      {getterwon:true}
    ]
  })
  if (getNotificatio.length<=0){
    throw new ErrorResponse ('No Notification Found For This User',404)
  }
  return getNotificatio
}

const deleteReward = async (id) => {
  let reward = await NotificationModel.findByIdAndDelete(id);
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
