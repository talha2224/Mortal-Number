const { ErrorResponse } = require('../../Error/Utils')
const {RewardsModel}  = require ('../../Models')

const postReward = async(amount,won,lost,getterId,setterId) =>{
    try {
        let reward = await RewardsModel.create({amount:amount,won:won,lost:lost,getterProfileId:getterId,setterProfileId:setterId})
        if(reward){
            return reward
        }
        else{
            throw new ErrorResponse("failed to post data check your code",409)
        }
    } 
    catch (error) {
        throw new ErrorResponse(error.message,409)
    }
}

const getReward = async (id)=>{
    try {
        let reward = await RewardsModel.find({$or: [{getterProfileId: id}, {setterProfileId: id}]}).populate('getterProfileId').populate('setterProfileId')
        if(reward.length>0){
            return reward
        }
        else{
            throw new ErrorResponse('no reward found for this user',404)
        }
        
    } catch (error) {
        throw new ErrorResponse(error.message,404)
    }
}

const deleteReward = async (id)=>{
    try{
        let reward = await RewardsModel.findByIdAndDelete(id)
        if(reward){
            return {msg:'reward deleted sucesffuly'}
        }
        else{
            throw new ErrorResponse('no reward found for this id failed to delete',404)
        }  
    }
    catch (error) {
        throw new ErrorResponse(error.message,404)
    }
}
module.exports = {postReward,getReward,deleteReward}