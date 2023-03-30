const { ErrorResponse } = require("../../Error/Utils")
const { GetterCreditModel } = require("../../Models")

const requestCredit = async (getterId,setterId,amount) =>{
    try {
        let request = await GetterCreditModel.create({amount:amount,getterId:getterId,setterId:setterId})
        if(request){
            return request
        }
        else{
            throw new ErrorResponse('failed to post request',401)
        }
    } 
    catch (error) {
        throw new   ErrorResponse(error,401)
    }

}

const updateCredit = async (id,amount,approved)=>{
    try {
        let update = await GetterCreditModel.findByIdAndUpdate(id,{
            $set:{
                amount:amount,
                approved:approved
            },  
        },{new:true})
        if (update){
            return update
        }
        else{
            throw new ErrorResponse('failed to update',304)
        }

    } 
    catch (error) {
        throw new ErrorResponse(error,304)
    }
}

const deleteRequest = async (id)=>{
        try {
            let Deleterequest = await GetterCreditModel.findByIdAndDelete(id)
            if(Deleterequest){
                return {msg:"deleted sucesfull"}
            }
            else{
                throw new ErrorResponse('failed to delete request wrong id is given',401)
            }
        } 
        catch (error) {
            throw new   ErrorResponse(error,500)
        }
    
    
}

const getAll = async ()=>{
    try {
        let allRequest = await GetterCreditModel.find({}).populate('setterId').populate('getterId')
        if(allRequest.length>0){
            return allRequest
        }
        else{
            throw new ErrorResponse("no request found",404)
        }
    } 
    catch (error) {
       throw new ErrorResponse(error,404) 
    }
}

const getSingle = async (id)=>{
    try {
        let singleRequest = await GetterCreditModel.findById(id).populate('getterId').populate('setterId')
        if(singleRequest){
            return singleRequest
        }
        else{
            throw new ErrorResponse("no request found",404)
        }
    }
    catch (error) {
       throw new ErrorResponse(error,404) 
    }
}

module.exports = {requestCredit,updateCredit,deleteRequest,getAll,getSingle}