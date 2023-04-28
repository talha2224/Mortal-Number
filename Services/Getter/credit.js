
const { ErrorResponse } = require("../../Error/Utils")
const { GetterCreditModel, GetterRegisterModel, SetterRegisterModel } = require("../../Models")


//POST CREDIT REQUEST 
const requestCredit = async (getterId,setterId,amount) =>{
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


//GET CREDIT BY GETTER OR SETTER ID
const getCreditHistory = async(id)=>{
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


//IF THE REQUEST NOT ACCEPTED
const deleteRequest = async (id)=>{
    let Deleterequest = await GetterCreditModel.findByIdAndDelete(id)
    if(Deleterequest){
            return {msg:"deleted sucesfull"}
    }
    else{
        throw new ErrorResponse('failed to delete request wrong id is given',401)
    }
    
    
}

//ALL REQUESTS
const getAll = async ()=>{
       const allRequest= await GetterCreditModel.find({approved: false})
        .populate('getterProfileId setterProfileId','-OTP -otpValidTill -otpVerified -email -password -phonenumber -dateOfBirth -gender -country -__v')
        if(allRequest.length>0){
            return allRequest.filter((item)=>{
                if(item.getterProfileId){
                    if(item.getterProfileId.accountMuted===false){
                        return item
                    }
                }
                if(item.setterProfileId){
                    if(item.setterProfileId.accountMuted===false){
                        return item
                    }
                }
            })
        }
        else{
            throw new ErrorResponse("no request found",404)
        }
}

//SINGLE REQUEST
const getSingle = async (id)=>{
        let singleRequest = await GetterCreditModel.findById(id).populate('getterProfileId','-OTP -otpValidTill -otpVerified -email -password -phonenumber -dateOfBirth -gender -_id -country').populate('setterProfileId','-OTP -otpValidTill -otpVerified  -email -password -phonenumber -dateOfBirth -gender -_id -country')
        if(singleRequest){
            return singleRequest
        }
        else{
            throw new ErrorResponse("no request found",404)
        }
}

module.exports = {requestCredit,deleteRequest,getAll,getSingle,acceptedCreditRequest,getCreditHistory}