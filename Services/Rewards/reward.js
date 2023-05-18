const { ErrorResponse } = require('../../Error/Utils')
const { RewardsModel } = require('../../Models')

const getRewards = async(id)=>{
    let getRewards = await RewardsModel.find({
        $or: [
          { getterId:id },
          { setterId: id },
        ]
      }).populate('getterId setterId gameId ')
      if (getRewards.length<=0){
        throw new ErrorResponse ('No Notification Found For This User',404)
      }
      return getRewards
}


module.exports = {getRewards}