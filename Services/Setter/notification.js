const { ErrorResponse } = require("../../Error/Utils");
const { NotificationModel } = require("../../Models");


const getSetterNotification = async (id)=>{
    let findNotification  = await NotificationModel.find({role:"setter",setterId:id}).populate('setterId', '_id firstName lastName username profileImage role')
    .populate('guesserId', '_id firstName lastName username profileImage role').populate("gameId" , "stake prize setterId totalEarn")
    if (findNotification.length>0){
        return findNotification
    }
    else{
        throw new ErrorResponse("no notification found",404)
    }
}


module.exports = {getSetterNotification}