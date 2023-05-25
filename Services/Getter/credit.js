const { ErrorResponse } = require("../../Error/Utils");
const { GetterInfo } = require("../../Models");
const { SetterInfo } = require("../../Models");
const {GetterCreditModel} = require("../../Models");

//POST CREDIT REQUEST
const requestCredit = async (getterId, setterId, amount) => {

  if (getterId) {
    let getterInfo = await GetterInfo.findById(getterId);
    if (getterInfo) {
      if (getterInfo.accountBlocked) {
        throw new ErrorResponse("account has been blocked ", 403);
      } 

      let request = await GetterCreditModel.create({
        amount: amount,
        guesserId: getterId,
        role:"guesser"
      });
      if (request) {
        return request;
      } 
      else {
        throw new ErrorResponse("failed to post request", 401);
      }
    }
  }

  else if (setterId) {
    let setterInfo = await SetterInfo.findById(setterId);
    if (setterInfo) {
      if (setterInfo.accountBlocked) {
        throw new ErrorResponse("account has been blocked ", 403);
      } 
      let request = await GetterCreditModel.create({
        amount: amount,
        setterId: setterId,
        role:"setter"
      });
      if (request) {
        return request;
      }
    }
  }
};

//IF THE REQUEST ACCEPTED
const acceptedCreditRequest = async (requestId) => {
  let findCreditDetails = await GetterCreditModel.findById(requestId)
  if (!findCreditDetails){
    throw new ErrorResponse("wrong id has been pass no credit request found",404)
  }
  else if (findCreditDetails.approved){
    throw new ErrorResponse("Already Credit Request Accepted",450)
  }
  let creditInfo = await GetterCreditModel.findByIdAndUpdate(requestId,{$set: { approved: true },},{ new: true });
  if (creditInfo.setterId){
    let findSetter = await SetterInfo.findById(creditInfo.setterId)
    let updateSetterAmount = await SetterInfo.findByIdAndUpdate(creditInfo.setterId,{$set:{
      credit:findSetter.credit+findCreditDetails.amount
    }},{new:true})
    if (updateSetterAmount){
      return {msg:"Request Accepted Amount Has Been Transfer"}
    }
  }
  else if (creditInfo.guesserId){
    let creditInfo = await GetterCreditModel.findByIdAndUpdate(requestId,{$set: { approved: true },},{ new: true });
    if (creditInfo.guesserId){
      let findGuesser = await GetterInfo.findById(creditInfo.guesserId)
      let updateGuesserAmount = await GetterInfo.findByIdAndUpdate(creditInfo.guesserId,{$set:{
        credit:findGuesser.credit+findCreditDetails.amount
      }},{new:true})
      if (updateGuesserAmount){
        return {msg:"Request Accepted Amount Has Been Transfer"}
      }
    }
    
  }

};

//GET CREDIT BY GETTER OR SETTER ID
const getCreditHistory = async (id) => {
  let CreditHistory = await GetterCreditModel.find({
    $or: [{ setterId: id }, { guesserId: id }],
  }).populate('setterId', '_id firstName lastName username profileImage role').populate('guesserId', '_id firstName lastName username profileImage role')
  if (CreditHistory) {
    return CreditHistory;
  } else {
    throw new ErrorResponse("no credit request found", 404);
  }
};

//IF THE REQUEST NOT ACCEPTED
const deleteRequest = async (id) => {
  let Deleterequest = await GetterCreditModel.findByIdAndDelete(id);
  if (Deleterequest) {
    return { msg: "deleted sucesfull" };
  } else {
    throw new ErrorResponse("failed to delete request wrong id is given", 401);
  }
};

//ALL REQUESTS
const getAll = async () => {
  const allRequest = await GetterCreditModel.find({ approved: false }).populate("userProfileId","-OTP -otpValidTill -otpVerified -email -password -phonenumber -dateOfBirth -gender -country -__v"
  );
  if (allRequest.length > 0) {
    return allRequest.filter((item) => {
      if (item.userProfileId) {
        if (item.userProfileId.accountMuted === false) {
          return item;
        }
      }
    });
  } else {
    throw new ErrorResponse("no request found", 404);
  }
};



//SINGLE REQUEST
const getSingle = async (id) => {
  let singleRequest = await GetterCreditModel.findById(id).populate('setterId', '_id firstName lastName username profileImage role')
  .populate('guesserId', '_id firstName lastName username profileImage role')
  if (singleRequest) {
    return singleRequest;
  } else {
    throw new ErrorResponse("no request found", 404);
  }
};

module.exports = {
  requestCredit,
  deleteRequest,
  getAll,
  getSingle,
  acceptedCreditRequest,
  getCreditHistory,
};
