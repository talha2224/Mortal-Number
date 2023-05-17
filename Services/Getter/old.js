

// REGISTER 

// const register = async (firstname, lastname, email, password,promo) => {
//   const findGetter = await GetterRegisterModel.findOne({ email: email });
//   if (findGetter) {
//     throw new ErrorResponse("email already registered", 403);
//   } 
//    if (!promo){
//       let hash = await bcrypt.hash(password, 10);
//       let promoCode =generateRandomString()
//       let setter = await GetterRegisterModel.create({firstName: firstname,lastName: lastname,email: email,password: hash,credit: 500,promoCode:promoCode});
//         if (setter) {
//           let token = jwt.sign({ setter }, process.env.secretKey);
//           let {OTP,otpValidTill,otpVerified,password,createdAt,updatedAt, __v,...getterInfo} = setter._doc;
//           return { getterInfo, token };
//         }
//       }
//       else if (promo){
//           let hash = await bcrypt.hash(password, 10);
//           let promoCode =generateRandomString()

//           let setterupdateInviter = await SetterRegisterModel.findOne({promoCode:promo})
//           let getterupdateInviter = await GetterRegisterModel.findOne({promoCode:promo})

//           if (getterupdateInviter){
//             let setter = await GetterRegisterModel.create({firstName: firstname,lastName: lastname,email: email,password: hash,credit: 500,promoCode:promoCode});
//             if (setter) {
//               let token = jwt.sign({ setter }, process.env.secretKey);
//               let {OTP,otpValidTill,otpVerified,password,createdAt,updatedAt, __v,...getterInfo} = setter._doc;
//               let updateCredit = await GetterRegisterModel.findOneAndUpdate({promoCode:promo},{$set:{
//                 credit:getterupdateInviter.credit+500
//               }},{new:true})
//               return { getterInfo, token };
//             }
//           }
//           else if (setterupdateInviter){
//             let setter = await GetterRegisterModel.create({firstName: firstname,lastName: lastname,email: email,password: hash,credit: 500,promoCode:promoCode});
//             if (setter) {
//               let token = jwt.sign({ setter }, process.env.secretKey);
//               let {OTP,otpValidTill,otpVerified,password,createdAt,updatedAt, __v,...getterInfo} = setter._doc;
//               let updateCredit = await SetterRegisterModel.findOneAndUpdate({promoCode:promo},{$set:{
//                 credit:setterupdateInviter.credit+500
//               }},{new:true})
//               return { getterInfo, token };
//             }
//           }
//           else{
//           throw new ErrorResponse ('WRONG PROMO CODE NO SUCH PROMO CODE FOUND',422)
//           }
//       }
  
// }

// login
// const login = async (email, password) => {
//     const loginGetter = await GetterRegisterModel.findOne({ email: email });
//     if (loginGetter) {
//         if (loginGetter.accountBlocked === false) {
//             let comparePassword = await bcrypt.compare(
//                 password,
//                 loginGetter.password
//               );
//               if (comparePassword) {
//                   let token = jwt.sign({ loginGetter }, process.env.secretKey);
//         if (token) {
//           let {
//               OTP,
//               otpValidTill,
//               otpVerified,
//               password,
//               createdAt,
//               updatedAt,
//               __v,
//               ...getterInfo
//             } = loginGetter._doc;
//             return { getterInfo, token };
//           } else {
//               throw new ErrorResponse("failed to generate token", 500);
//             }
//           } else {
//         throw new ErrorResponse("invalid credentials", 400);
//       }
//     } else if (loginGetter.accountBlocked === true) {
//         throw new ErrorResponse("your account has been blocked", 403);
//       }
//     } else {
//         throw new ErrorResponse("account not found", 404);
//       }
// };


//UPDATE GETTER PROFILE
// const update = async (id,firstname,lastname,email,username,phonenumber,dateOfBirth,gender,country,image,accountBlocked,accountMuted) => {
//     let getGetter = await GetterRegisterModel.findById(id)
  
//     if (getGetter.accountBlocked===true){
//       throw new ErrorResponse('your account has been blocked',403)
//     }
  
//     let updateGetter = await GetterRegisterModel.findByIdAndUpdate(id,{
//       $set: {firstName: firstname,lastName: lastname,email: email,username: username,phonenumber: phonenumber,dateOfBirth: dateOfBirth,gender: gender,country: country,profileImage: image,accountBlocked: accountBlocked,accountMuted: accountMuted},
//     },
//     { new: true }
//   );
//   if (updateGetter) {
//     let {OTP,otpValidTill,otpVerified,password,createdAt,updatedAt,__v,...updatedInfo} = updateGetter._doc;
//     return updatedInfo;
//   } else {
//     throw new ErrorResponse("failed to update wrong id given", 304);
//   }
//   };


//GET GETTER
//const getGetter = async (id) => {
//     let singleGetter = await GetterRegisterModel.findById(id);
//     if (singleGetter) {
//       let {
//         OTP,
//         otpValidTill,
//         otpVerified,
//         createdAt,
//         password,
//         updatedAt,
//         __v,
//         ...getterInfo
//       } = singleGetter._doc;
//       return { getterInfo: getterInfo };
//     } else {
//       throw new ErrorResponse("Invalid Id ", 404);
//     }
//};

// DELETE USER
// const deleteGetter = async (id) => {
//     if (id) {
//       let deleteAccount = await GetterRegisterModel.findByIdAndDelete(id);
//       if (deleteAccount) {
//         return { msg: "account deleted", status: 200 };
//       } else {
//         throw new ErrorResponse("wrong id no account matched", 404);
//       }
//     } else {
//       throw new ErrorResponse("id is required", 404);
//     }
// };

//TOP 5 GETTER

// const topRated = async () => {
//     let top = await GetterRegisterModel.find({}).sort({ credit: -1 }).limit(20);
//     if (top) {
//       return top;
//     } else {
//       throw new ErrorResponse("no data found addsome", 404);
//     }
//};


// const forgetPassword = async (email) => {
//     let findUser = await GetterRegisterModel.findOne({ email: email });
//     if (findUser) {
//       let randomString = Math.floor(Math.random() * 9000) + 1000;
//       let Updated = await GetterRegisterModel.findOneAndUpdate(
//         { email: email },
//         {
//           $set: {
//             OTP: randomString,
//             otpValidTill: new Date(
//               new Date().setMinutes(new Date().getMinutes() + 5)
//             ),
//           },
//         },
//         { new: true }
//       );
//       if (Updated) {
//         ResetPassword(findUser.firstName, email, Updated.OTP);
//         return { msg: "OTP SENT TO YOUR ACCOUNT", otp: Updated.OTP };
//       }
//     } else {
//       throw new ErrorResponse("wrong email. Email not found", 404);
//     }
// };
  
// OTP VERIFCATION
// const otpVerification = async (otp) => {
//     let findUser = await GetterRegisterModel.findOne({ OTP: otp });
//     if (findUser) {
//       if (findUser.otpValidTill > Date.now()) {
//         let updateVerify = await GetterRegisterModel.findOneAndUpdate(
//           { OTP: otp },
//           {
//             $set: {
//               otpVerified: true,
//             },
//           }
//         );
//         if (updateVerify) {
//           return { msg: "OTP VERIFIED", sucess: true };
//         } else {
//           return { msg: "OTP NOT VERIFIED", sucess: false, status: 500 };
//         }
//       } else {
//         let deleteOtp = await GetterRegisterModel.findOneAndUpdate(
//           { OTP: otp },
//           {
//             $set: {
//               OTP: null,
//               otpValidTill: null,
//             },
//           }
//         );
//         throw new ErrorResponse(
//           "otp timeout please again call forget password api",
//           408
//         );
//       }
//     } else {
//       throw new ErrorResponse("wrong otp given", 404);
//     }
// };
  
//RESET PASSWORD
// const resetPassword = async (email, password) => {
//     let findUser = await GetterRegisterModel.findOne({ email: email });
//     if (findUser) {
//       if (findUser.otpVerified === true) {
//         let hash = await bcrypt.hash(password, 10);
//         let updatePassword = await GetterRegisterModel.findOneAndUpdate(
//           { email: email },
//           {
//             $set: {
//               password: hash,
//               OTP: null,
//               otpValidTill: null,
//               otpVerified: false,
//             },
//           }
//         );
//         if (updatePassword) {
//           return { msg: "password updated sucesfully sucesfully" };
//         }
//       } else {
//         throw new ErrorResponse("otp not verified please verified first", 500);
//       }
//     } else {
//       throw new ErrorResponse("invalid OTP", 404);
//     }
// };