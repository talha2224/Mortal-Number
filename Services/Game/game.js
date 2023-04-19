const { ErrorResponse } = require("../../Error/Utils")
const { GameModel, GetterRegisterModel,RewardsModel} = require("../../Models")

const postGame = async(id,winningnumber,stake,prize,hours,minutes,seconds)=>{
    let findSetter = await GameModel.findOne({setterId:id})
    if(findSetter){
        throw new ErrorResponse("you can not post another game wait for the update",403)
    }
    else{
        try {
            const duration = {
                hours:hours,
                min:minutes,
                sec:seconds
            }
            let createGame = await GameModel.create({setterId:id,winningNumber:winningnumber,stake:stake,prize:prize,duration:duration})
            if(createGame){
                return createGame
            }
            else{
                throw new ErrorResponse('failed to post game',409)
            }
        } 
        catch (error) {
            throw new ErrorResponse(error,500)
        }
    }
}

const getGame = async ()=>{
    try {
        let allGame = await GameModel.find({active:true}).populate('setterId')
        if (allGame.length>0){
            return allGame
        }
        else{
            throw new ErrorResponse ('NO GAME FOUND PLEASE ADD SOME',404)
        }
    } 
    catch (error) {
        throw new ErrorResponse(error,404)
    }
}

const singleGame = async (id)=>{
    try {
            let singleGame = await GameModel.findOne({_id:id,active:true}).populate('setterId')
            if (singleGame){
                return singleGame
            }
            else{
                throw new ErrorResponse ('NO GAME FOUND PLEASE ADD SOME',404)
            }
    } 
    catch (error) {
            throw new ErrorResponse(error,500)
    }
     
}

const deleteGame = async (id)=>{
    try {
        let deleteGame = await GameModel.findByIdAndDelete(id)
        if (deleteGame){
            return {msg:"GAME DELETED",status:200}
        }
        else{
            throw new ErrorResponse ('NO GAME FOUND FAILED TO DELETE',404)
        }
    } 
    catch (error) {
        throw new ErrorResponse(error,404)
    }
}

const updateGame = async (id,winningnumber,deletewinningnumber,stake,prize,winners,deleteWinner)=>{
    try {
        let updated = await GameModel.findByIdAndUpdate(id,{
            $push:{
                winBy:winners,
                winningNumber:winningnumber,
            },
            $set:{
                stake:stake,
                prize:prize,
            },
            $pull:{
                winBy:deleteWinner,
                winningNumber:deletewinningnumber
            }
        },{new:true})
        if(updated){
            return updated
        }
        else{
            throw new ErrorResponse("Failed To Update",304)
        }
    } 
    catch (error) {
        throw new ErrorResponse(error,304)   
    }
}

const playGame = async (getterid,gameid)=>{
    let findUserCredit = await GetterRegisterModel.findById(getterid)
    let findGameId = await GameModel.findById(gameid)

    if (findUserCredit.credit>=findGameId.stake){
        let minusStake= await GetterRegisterModel.findByIdAndUpdate(getterid,{$set:{
            credit:findUserCredit.credit-findGameId.stake
        }},{new:true})
        return findGameId
    }
    else{
        throw new ErrorResponse('not enough credit',402)
    }
}

const afterGame = async (getterid,gameid,win)=>{
    
    if (win===true){
        let findUserCredit = await GetterRegisterModel.findById(getterid)
        let findGameId = await GameModel.findById(gameid)
        let updateGetterAmount = await GetterRegisterModel.findByIdAndUpdate(getterid,{$set:{credit:findUserCredit.credit+findGameId.stake}},{new:true})
        let postReward = await RewardsModel.create({amount:findGameId.stake,won:true,getterProfileId:getterid})
        console.log(`getter updated amount ${updateGetterAmount}`)
        console.log(`reward posted ${postReward}`)
        return {msg: `You Won The Amount`,amount:findGameId.stake,totalAmount:findUserCredit.credit+findGameId.stake}
    }
    else if (win===false){
        let findGameId = await GameModel.findById(gameid)
        let postReward = await RewardsModel.create({amount:findGameId.stake,won:false,getterProfileId:getterid})
        return {msg:"You Lost The Game"}
    }

}

module.exports ={postGame,getGame,singleGame,deleteGame,updateGame,playGame,afterGame}