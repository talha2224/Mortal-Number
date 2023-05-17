const { ErrorResponse } = require("../../Error/Utils");
const {GetterCreditModel, UserInfo} = require("../../Models");

//POST CREDIT REQUEST
const requestCredit = async (userId, amount) => {
    let getterInfo = await UserInfo.findById(userId);

    if (getterInfo) {
      if (getterInfo.accountBlocked) {
        throw new ErrorResponse("account has been blocked ", 403);
      } 
      else {
        let request = await GetterCreditModel.create({
          amount: amount,
          userProfileId: userId,
        });
        if (request) {
          return request;
        } 
        else {
          throw new ErrorResponse("failed to post request", 401);
        }
      }
    }

};


//IF THE REQUEST ACCEPTED

const acceptedCreditRequest = async (requestId) => {  
  let creditInfo = await GetterCreditModel.findByIdAndUpdate(requestId,{$set: { approved: true },},{ new: true });

  if (!creditInfo) {
    throw new ErrorResponse("wrong credit request id given no such request found",404);
  } 
  else {
    let getUser = await UserInfo.findById(creditInfo.userProfileId)
    if (!getUser){
      throw new ErrorResponse("No User Found Who Request The Credit",404)
    }
    let updateAmount = await UserInfo.findByIdAndUpdate(creditInfo.userProfileId,{$set:{credit:UserInfo.credit+creditInfo.amount}},{new:true})
    if (updateAmount){
      return {msg:"request accepeted",sucess:true}
    }
  }
};

//GET CREDIT BY GETTER OR SETTER ID
const getCreditHistory = async (id) => {
  let CreditHistory = await GetterCreditModel.find({userProfileId:id});
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
  let singleRequest = await GetterCreditModel.findById(id)
    .populate(
      "userProfileId",
      "-OTP -otpValidTill -otpVerified -email -password -phonenumber -dateOfBirth -gender -_id -country"
    )
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
