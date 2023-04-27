const { ErrorResponse } = require("../../Error/Utils")
const { GameModel, GetterRegisterModel,SetterRegisterModel,RewardsModel} = require("../../Models")

const postGame = async(id,winningnumber,stake,prize,hours,minutes,seconds)=>{
    try {
        let findSetter = await GameModel.findOne({setterId:id}).populate('setterId')
        if(findSetter.setterId.accountBlocked){
            throw new ErrorResponse("your account has been blocked",403)
        }
        else if (findSetter){
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
        throw new ErrorResponse(error,403)
    }
}

//SETTER GET GAME
const getGame = async (getterId)=>{
    try {
        let allGame = await GameModel.find({active:true,winBy: { $nin: [getterId] }}).populate('setterId','-OTP -otpValidTill -otpVerified -credit -email -password -phonenumber -dateOfBirth -country').exec()
            if (allGame.length>0){
                return allGame
            }
            else{
                throw new ErrorResponse ('NO GAME FOUND OR YOU HAVE ALREADY PLAY ALL THE POSTED GAME',404)
            }
        
    } 
    catch (error) {
        throw new ErrorResponse(error,404)
    }
}

// SINGLE GAME
const singleGame = async (id)=>{
    try {
        let singleGame = await GameModel.findOne({_id:id,active:true}).populate('setterId','-OTP -otpValidTill -otpVerified -credit -email -password -phonenumber -_id  -dateOfBirth -country')
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

//FIND BY GETTER ID
const findGame = async (id)=>{
    try {
        let findGame = await GameModel.findOne({setterId:id})
        if(findGame){
            return findGame
        }
        else{
            return {msg:'No game posted yet'}
        }
    } 
    catch (error) {
        throw new ErrorResponse(error.message,500)
    }
}

// ALREDAY POSTED
const checkGame = async (id)=>{
    try {
        let findGame = await GameModel.findOne({setterId:id})
        if(findGame){
            throw new ErrorResponse('you have alreday posted a game',500)
        }
        else{
            return {msg:'No game posted yet'}
        }
    } 
    catch (error) {
        throw new ErrorResponse(error.message,500)
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

const afterGame = async (getterid,gameid,answer,setterid)=>{
    try {
        let findUserCredit = await GetterRegisterModel.findById(getterid)
        let findGameId = await GameModel.findById(gameid)
        let check =  findGameId.winningNumber.every(item=>answer.includes(item))
        if (check){
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
        else{
            let postReward = await RewardsModel.create({amount:findGameId.prize,won:false,getterProfileId:getterid})
            let getSetterDetails = await SetterRegisterModel.findById(setterid)
            let updateSetterAmount= await SetterRegisterModel.findByIdAndUpdate(setterid,{$set:{
                credit:getSetterDetails.credit+findGameId.stake
            }})
            let postSetterReward = await RewardsModel.create({amount:findGameId.stake,won:true,setterProfileId:setterid})
            return {msg:"You Lost The Game",creditLeftInYourAccount:findUserCredit.credit}
            }
    } 
    catch (error) {
        throw new ErrorResponse(error.message)
    }

}

//GET ACTIVE GAME FOR ADMIN
const showAdminGame= async()=>{
    try {
        let allActiveGame = await GameModel.find({})
    } 
    catch (error) {
        
    }
}

module.exports ={postGame,getGame,singleGame,deleteGame,updateGame,playGame,afterGame,findGame,checkGame}