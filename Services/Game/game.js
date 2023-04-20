const { ErrorResponse } = require("../../Error/Utils")
const { GameModel, GetterRegisterModel,SetterRegisterModel,RewardsModel} = require("../../Models")

const postGame = async(id,winningnumber,stake,prize,hours,minutes,seconds)=>{
    try {
        let findSetter = await GameModel.findOne({setterId:id})
        if(findSetter){
            throw new ErrorResponse("you can not post another game wait for the update",403)
        }
        else{
            let setterId = await SetterRegisterModel.findById(id)
            if (setterId.credit>=stake){
                let updateSetterCredit = await SetterRegisterModel.findByIdAndUpdate(id,{
                    $set:{
                        credit:setterId.credit - stake
                    }
                },{new:true})
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
            else{
                throw new ErrorResponse("you donot have enough credit",402)
            }
        }
        
    } 
    catch (error) {
        throw new ErrorResponse(error)
    }
}

const getGame = async (getterId)=>{
    try {
        let allGame = await GameModel.find({active:true,winBy: { $nin: [getterId] }}).populate('setterId')
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
    try {

        let findUserCredit = await GetterRegisterModel.findById(getterid)
        let findGameId = await GameModel.findById(gameid)

        if (findUserCredit && findGameId){
            if (findUserCredit.credit>=findGameId.stake){
                let minusStake= await GetterRegisterModel.findByIdAndUpdate(getterid,{$set:{
                        credit:findUserCredit.credit-findGameId.stake
                }},{new:true})
                return {msg:"YOU CAN PLAY THE GAME CREDIT MINUS FROM YOUR ACCOUNT"}
            }
            else{
                throw new ErrorResponse('not enough credit',402)
            }
        }
        else{
            throw new ErrorResponse("wrong id hase been pass",404)
        }
    } 
    catch (error) {
        throw new ErrorResponse(error,402)
    }

}

const afterGame = async (getterid,gameid,win)=>{
    try {
        let findUserCredit = await GetterRegisterModel.findById(getterid)
        let findGameId = await GameModel.findById(gameid)
        if (win===true){
            let updateGetterAmount = await GetterRegisterModel.findByIdAndUpdate(getterid,{$set:{credit:findUserCredit.credit+findGameId.prize}},{new:true})
            let postReward = await RewardsModel.create({amount:findGameId.prize,won:true,getterProfileId:getterid})
            let updateGame = await GameModel.findByIdAndUpdate(gameid,{
                $push:{
                   winBy:getterid 
                }
            },{new:true})
            console.log(updateGame)
            if(updateGetterAmount && postReward && updateGame){
                return {msg: `You Won The Amount`,amount:findGameId.prize,totalAmount:findUserCredit.credit+findGameId.prize}
            }
            else{
                throw new ErrorResponse("CHECK YOUR BACKEND CODE ON LINE 170",400)
            }
        }
        else if (win===false){
            let postReward = await RewardsModel.create({amount:findGameId.prize,won:false,getterProfileId:getterid})
            return {msg:"You Lost The Game",creditLeftInYourAccount:findUserCredit.credit}
        }
    } 
    catch (error) {
        throw new ErrorResponse(error)
    }

}

module.exports ={postGame,getGame,singleGame,deleteGame,updateGame,playGame,afterGame}