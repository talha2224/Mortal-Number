const { ErrorResponse } = require("../../Error/Utils");
const {GetterInfo, SetterInfo } = require("../../Models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");



// RESET PASSWORD NODEMAILER CONFIGURATION
const ResetPassword = (name, email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "talhahaider074@gmail.com",
        pass: "bwmcuysleqrlcemu",
      },
    });
    const mailOptions = {
      from: "talhahaider074@gmail.com",
      to: email,
      subject: "RESET PASSWORD EMAIL",
      html: `<p> Hi ${name} this is your reset password code ${otp}</p>`,
    };
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log("mail send", info.response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

//RANDOM STRING
function generateRandomString() {
  const length = 10;
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}


// REGITSER
const register = async(firstname, lastname, email, password,promo,username)=>{
  const findUser = await GetterInfo.findOne({email:email})
  const findByName = await GetterInfo.findOne({username:username})
    if (findUser || findByName){
      if (findUser){
          throw new ErrorResponse("User Already Registered To This Email", 403);
      }
      else if (findByName){
        throw new ErrorResponse("Username Already Taken", 405);
      }
    }
  else if (!promo){
    let hash = await bcrypt.hash(password,10)
    let promoCode =generateRandomString()
    let createdUser = await GetterInfo.create({firstName: firstname,lastName: lastname,email: email,password: hash,credit: 500,promoCode:promoCode,role:'guesser',username:username})
    if (createdUser) {
      let token = jwt.sign({ createdUser }, process.env.secretKey);
      let {OTP,otpValidTill,otpVerified,password,createdAt,updatedAt,accountBlocked,accountMuted, __v,...getterInfo} = createdUser._doc;
      return { getterInfo, token };
    }
  }
  else if (promo){
    let hash = await bcrypt.hash(password, 10);
    let promoCode =generateRandomString();
    let userPromoFind = await GetterInfo.findOne({promoCode:promo})
    let anotherPromoFind =await SetterInfo.findOne({promoCode:promo})

    if (!userPromoFind && !anotherPromoFind){
      throw new ErrorResponse(" No Such PromoCode Found Invalid Promo Code",404)
    }

    if (userPromoFind){
      let updateAmount = await GetterInfo.findOneAndUpdate({promoCode:promo},{$set:{
        credit:userPromoFind.credit+500
      }})
      if (updateAmount){
        let createdUser = await GetterInfo.create({firstName: firstname,lastName: lastname,email: email,password: hash,credit: 500,promoCode:promoCode,role:'guesser',username:username})
        if (createdUser) {
          let token = jwt.sign({ createdUser }, process.env.secretKey);
          let {OTP,otpValidTill,otpVerified,password,createdAt,updatedAt,accountBlocked,accountMuted,__v,...getterInfo} = createdUser._doc;
          return { getterInfo, token };
        }
      }

    }
    if (anotherPromoFind){
      let updateAmount = await SetterInfo.findOneAndUpdate({promoCode:promo},{$set:{
        credit:anotherPromoFind.credit+500
      }})
      if (updateAmount){
        let createdUser = await GetterInfo.create({firstName: firstname,lastName: lastname,email: email,password: hash,credit: 500,promoCode:promoCode,role:'guesser',username:username})
        if (createdUser) {
          let token = jwt.sign({ createdUser }, process.env.secretKey);
          let {OTP,otpValidTill,otpVerified,password,createdAt,updatedAt,accountBlocked,accountMuted,__v,...getterInfo} = createdUser._doc;
          return { getterInfo, token };
        }
      }

    }


  }
}

// LOGIN
const login = async (email, password) => {
      const loginUser = await GetterInfo.findOne({ email: email });
      if (!loginUser){
        throw new ErrorResponse("account not found", 404);
      }

      else if (loginUser.accountBlocked === false) {
        let comparePassword = await bcrypt.compare(password,loginUser.password);
        if (!comparePassword){
          throw new ErrorResponse("invalid credentials", 400);
        }
        let token = jwt.sign({ loginUser }, process.env.secretKey);

        if (token) {
          let {OTP,otpValidTill, otpVerified,password,createdAt,updatedAt,__v,...getterInfo} = loginUser._doc;
          return { getterInfo, token };
        }
      } 
      else if (loginUser.accountBlocked === true) {
        throw new ErrorResponse("your account has been blocked by admin", 403);
      }
};

// UPDATE USER
const update = async (id,firstname,lastname,email,username,phonenumber,dateOfBirth,gender,country,image,accountBlocked,accountMuted) => {
  let getUser = await GetterInfo.findById(id)
  if (!getUser){
    throw new ErrorResponse('No User Found For This Id',404)
  }
  let updateUser = await GetterInfo.findByIdAndUpdate(id,{$set: {firstName: firstname,lastName: lastname,email: email,username: username,phonenumber: phonenumber,dateOfBirth: dateOfBirth,gender: gender,country: country,profileImage: image,accountBlocked: accountBlocked,accountMuted: accountMuted}},{ new: true });
  if (updateUser) {
    let {OTP,otpValidTill,otpVerified,password,createdAt,updatedAt,__v,...updatedInfo} = updateUser._doc;
    return updatedInfo;
  } 
  else {
    throw new ErrorResponse("failed to update wrong id given", 304);
  }
};


// GET SINGLE USER
const getGetter = async (id) => {
  let singleUser = await GetterInfo.findById(id);
  if (!singleUser) {
    throw new ErrorResponse("Invalid Id ", 404);
  }
  else if (singleUser.accountBlocked===true){
    throw new ErrorResponse("your account has been blocked by admin", 403);
  }
  let {OTP,otpValidTill,otpVerified,createdAt,password,updatedAt,__v,...userInfo} = singleUser._doc;
  return { getterInfo: userInfo };
}; 

// DELETE USER
const deleteGetter = async (id) => {
  if (!id){
    throw new ErrorResponse ('Id is Required To Delete User')
  }
  let deleteAccount = await GetterInfo.findByIdAndDelete(id)
  if(!deleteAccount){
    throw new ErrorResponse('You have passed wrong id',402)
  }
  return {msg:"User Account Deleted"}
};

//TOP 5 GETTER
const topRated = async () => {
  let top = await GetterInfo.find({accountBlocked:false}).sort({ credit: -1 }).limit(20);
  if (top.length<0) {
    throw new ErrorResponse('No Guesser is Registered So, no top rated found',404)
  } 
  return top;
};

//CHANGE PASSWORD
const changePassword = async (id, oldpassword, newpassword) => {
  let find = await GetterInfo.findById(id);
  if (find) {
    let comparePassword = await bcrypt.compare(oldpassword, find.password);
    if (comparePassword) {
      let hash = await bcrypt.hash(newpassword, 10);
      let update = await GetterInfo.findByIdAndUpdate(
        id,
        {
          $set: {
            password: hash,
          },
        },
        { new: true }
      );
      if (update) {
        return { msg: "password updated sucesfully" };
      }
    } else {
      throw new ErrorResponse("wrong password", 401);
    }
  } else {
    throw new ErrorResponse("wrong user id passed no reacord found", 404);
  }
};

// CONST BLOCK USER
const blockUser = async (id) => {
  let findUserAndUpdate = await GetterInfo.findByIdAndUpdate(id, {
    $set: {
      accountBlocked: true,
    },
  });
  if (findUserAndUpdate) {
    return { msg: "YOUR ACCOUNT HAS BEEN BLOCKED" };
  } 
  else {
    throw new ErrorResponse("WRONG ID GIVEN FAILED TO BLOCK USER", 404);
  }
};

const forgetPassword = async (email) => {
  let findUser = await GetterInfo.findOne({ email: email });

  if (!findUser){
    throw new ErrorResponse("wrong email. Email not found", 404);
  }
  let randomString = Math.floor(Math.random() * 9000) + 1000;
  let Updated = await GetterInfo.findOneAndUpdate({ email: email },
    {$set: {OTP: randomString,otpValidTill: new Date(new Date().setMinutes(new Date().getMinutes() + 5))}},{ new: true });
  if (Updated) {
    ResetPassword(findUser.firstName, email, Updated.OTP);
    return { msg: "OTP SENT TO YOUR ACCOUNT", otp: Updated.OTP };
  }
};

// OTP VERIFCATION
const otpVerification = async (otp) => {
  let findUser = await GetterInfo.findOne({ OTP: otp });
  if (!findUser){
    throw new ErrorResponse("wrong otp given", 404);
  }
  else if (findUser.otpValidTill > Date.now()) {
    let updateVerify = await GetterInfo.findOneAndUpdate({ OTP: otp },{$set: {otpVerified: true,}});
    if (updateVerify) {
      let deleteOtp = await GetterInfo.findOneAndUpdate({OTP:otp},{$set:{OTP: null,otpValidTill: null}})
      return { msg: "OTP VERIFIED", sucess: true };
    } 
    else {
      return { msg: "OTP NOT VERIFIED", sucess: false, status: 500 };
    }
  } 
  let deleteOtp = await GetterInfo.findOneAndUpdate({ OTP: otp },{$set: {OTP: null,otpValidTill: null}});
  throw new ErrorResponse("otp timeout please again call forget password api",408);
};

//RESET PASSWORD
const resetPassword = async (email, password) => {
  let findUser = await GetterInfo.findOne({ email: email });
  if (findUser) {
    if (findUser.otpVerified === true) {
      let hash = await bcrypt.hash(password, 10);
      let updatePassword = await GetterInfo.findOneAndUpdate({ email: email },{$set: {password: hash,otpVerified: false}},{new:true});
      if (updatePassword) {
        return { msg: "password updated sucesfully sucesfully" };
      }
    } 
    else {
      throw new ErrorResponse("otp not verified please verified first", 500);
    }
  } 
  else {
    throw new ErrorResponse("invalid Email", 404);
  }
};

module.exports = {register,login,update,deleteGetter,getGetter,topRated,forgetPassword,resetPassword,otpVerification,changePassword,blockUser};
