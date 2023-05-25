const { ErrorResponse } = require("../../Error/Utils");
const { NotificationModel } = require("../../Models");


const getGetterNotification = async (id) => {
    try {
      const findNotification = await NotificationModel.find({
        $or: [
          { $and: [{ guesserId: id }, { role: 'guesser' }] },
          { title: 'New Game Posted' }
        ]
      }).populate('setterId', '_id firstName lastName username profileImage role')
      .populate('guesserId', '_id firstName lastName username profileImage role').populate("gameId" , "stake prize setterId totalEarn")
  
      if (findNotification.length > 0) {
        return findNotification;
      } else {
        throw new ErrorResponse('No notifications found', 404);
      }
    } catch (error) {
      throw new ErrorResponse('Error retrieving notifications', 500);
    }
  };


module.exports = {getGetterNotification}
