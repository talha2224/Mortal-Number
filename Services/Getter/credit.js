
const { ErrorResponse } = require("../../Error/Utils")
const { GetterCreditModel, GetterRegisterModel, SetterRegisterModel } = require("../../Models")


//POST CREDIT REQUEST 
const requestCredit = async (getterId,setterId,amount) =>{
    try {
        if (getterId){
            let getterInfo = await GetterRegisterModel.findById(getterId)
            if(getterInfo){
                if(getterInfo.accountBlocked){
                    throw new ErrorResponse('account has been blocked ',403)
                }
                else{
                    let request = await GetterCreditModel.create({amount:amount,getterProfileId:getterId})
                    if(request){
                        return request
                    }
                    else{
                        throw new ErrorResponse('failed to post request',401)
                    }
                }
            }
        }

        if(setterId){
            let setterInfo = await SetterRegisterModel.findById(setterId)
            if(setterInfo){
                if(setterInfo.accountBlocked){
                    throw new ErrorResponse('account has been blocked ',403)
                }
                else{
                    let request = await GetterCreditModel.create({amount:amount,setterProfileId:setterId})
                    if(request){
                        return request
                    }
                    else{
                        throw new ErrorResponse('failed to post request',401)
                    }
                }
            }
        }
        else{
        }
    } 
    catch (error) {
        throw new   ErrorResponse(error,401)
    }

}

// const updateCredit = async (id,getterId,setterid,amount,approved)=>{
//     try {
//         let update = await GetterCreditModel.findByIdAndUpdate(id,{
//             $set:{
//                 amount:amount,
//                 approved:approved
//             },  
//         },{new:true})
//         if (update){
//             if(getterId){
//                 let findGetter = await GetterRegisterModel.findById(getterId)
//                 if (updateCredit){
//                     let updateGetter = await GetterRegisterModel.findByIdAndUpdate(getterId,{$set:{
//                         credit:findGetter.credit+amount
//                     }})
//                 }
//             }
//             else if (setterid){

//             }
//             return update
//         }
//         else{
//             throw new ErrorResponse('failed to update',304)
//         }

//     } 
//     catch (error) {
//         throw new ErrorResponse(error,304)
//     }
// }


//IF THE REQUEST ACCEPTED

const acceptedCreditRequest = async(requestId,getterId,setterid,amount)=>{
    try {
       let  creditInfo = await GetterCreditModel.findByIdAndUpdate(requestId,{
        $set:{approved:true}
       },{new:true})

       if(!creditInfo){
        throw new ErrorResponse('wrong credit request id given no such request found',404)
       }
       else{
           if(creditInfo.getterProfileId){
               let getterInfo = await GetterRegisterModel.findById(creditInfo.getterProfileId)
               let updateGetterCredit = await GetterRegisterModel.findByIdAndUpdate(creditInfo.getterProfileId,{
                $set:{
                    credit:getterInfo.credit+creditInfo.amount
                }
               },{new:true})
               if(updateGetterCredit){
                    return {msg:"Request accepted"}
               }
               else{
                throw new ErrorResponse("Failed to accept request",501)
               }
            }
            else if (creditInfo.setterProfileId){
                let setterInfo = await SetterRegisterModel.findById(setterid)
                let updateSetterCredit= await SetterRegisterModel.findByIdAndUpdate(getterId,{
                    $set:{
                        credit:setterInfo.credit+amount
                    }
                },{new:true})
                if(updateSetterCredit){
                    return {msg:"Request accepted"}
                }
                else{
                    throw new ErrorResponse("Failed to accept request",501)
                }
            }
        } 

    } 
    catch (error) {
        throw new ErrorResponse(error.message)
    }
}


//GET CREDIT BY GETTER OR SETTER ID
const getCreditHistory = async(id)=>{
    try {
        let CreditHistory = await GetterCreditModel.find({
            $or: [
                { setterProfileId: id },
                { getterProfileId: id }
            ]
        })
        if(CreditHistory){
            return CreditHistory
        }
        else{
            throw new ErrorResponse("no credit request found",404)
        }
    } 
    catch (error) {
        throw new ErrorResponse(error.message,404)
    }
}


//IF THE REQUEST NOT ACCEPTED
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

//ALL REQUESTS
const getAll = async ()=>{
    try {
       const allRequest= await GetterCreditModel.find({approved: false,})
        .populate('getterProfileId setterProfileId','-OTP -otpValidTill -otpVerified -email -password -phonenumber -dateOfBirth -gender -country -__v')
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

//SINGLE REQUEST
const getSingle = async (id)=>{
    try {
        let singleRequest = await GetterCreditModel.findById(id).populate('getterProfileId','-OTP -otpValidTill -otpVerified -email -password -phonenumber -dateOfBirth -gender -_id -country').populate('setterProfileId','-OTP -otpValidTill -otpVerified  -email -password -phonenumber -dateOfBirth -gender -_id -country')
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

module.exports = {requestCredit,deleteRequest,getAll,getSingle,acceptedCreditRequest,getCreditHistory}