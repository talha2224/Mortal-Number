const { ErrorResponse } = require("../../Error/Utils")
const { GameModel } = require("../../Models")

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
        let allGame = await GameModel.find({active:true}).populate("setterId")
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
            let singleGame = await GameModel.findOne({_id:id,active:true}).populate("setterId")
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


module.exports ={postGame,getGame,singleGame,deleteGame,updateGame}