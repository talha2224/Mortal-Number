const { ErrorResponse } = require("../../Error/Utils");
const {GameModel, SetterInfo, GetterInfo } = require("../../Models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");


// NODE MAILER CONFIGURATION
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

// REGISTER USER
const register = async (firstname, lastname, email, password,promo,username) => {
  const findUser = await SetterInfo.findOne({ email: email });
  const findByName = await SetterInfo.findOne({username:username})

  if (findUser || findByName){
    if (findUser){
      throw new ErrorResponse("User Already Registered To This Email", 403);
    }
    else if (findByName){
      throw new ErrorResponse("Username Already Taken", 405);
    }
  }
  else {
    if(!promo){
      let hash = await bcrypt.hash(password, 10);
      let promoCode =generateRandomString();
      let setter = await SetterInfo.create({firstName: firstname,lastName: lastname,email: email,password: hash,credit: 500,promoCode:promoCode,role:"setter",username:username});
      if (setter) {
        let token = jwt.sign({ setter }, process.env.secretKey);
        let {OTP,otpValidTill,otpVerified,password,createdAt,updatedAt, __v,...setterInfo} = setter._doc;
        return { setterInfo, token };
      }
    }
    else if (promo){
      let hash = await bcrypt.hash(password, 10);
      let promoCode =generateRandomString();
      let userByPromo = await SetterInfo.findOne({promoCode:promo})
      let anotherPromo = await GetterInfo.findOne({promoCode:promo})

      if (!userByPromo && !anotherPromo){
        throw new ErrorResponse('Wrong promo code no such promocode found',404)
      }

      else if (userByPromo){
        let updateAmount = await SetterInfo.findOneAndUpdate({promoCode:promo},{$set:{credit:userByPromo.credit+500}},{new:true})
        if (updateAmount){
          let createAccount = await SetterInfo.create({firstName: firstname,lastName: lastname,email: email,password: hash,credit: 500,promoCode:promoCode,role:'setter',username:username})
          if (createAccount){
            let token = jwt.sign({ createAccount }, process.env.secretKey);
            let {OTP,otpValidTill,otpVerified,password,createdAt,updatedAt, __v,...setterInfo} = createAccount._doc;
            return { setterInfo, token };
          }
  
        }
      }

      else if (anotherPromo){
        let updateAmount = await GetterInfo.findOneAndUpdate({promoCode:promo},{$set:{credit:anotherPromo.credit+500}},{new:true})
        if (updateAmount){
          let createAccount = await SetterInfo.create({firstName: firstname,lastName: lastname,email: email,password: hash,credit: 500,promoCode:promoCode,role:'setter'})
          if (createAccount){
            let token = jwt.sign({ createAccount }, process.env.secretKey);
            let {OTP,otpValidTill,otpVerified,password,createdAt,updatedAt, __v,...setterInfo} = createAccount._doc;
            return { setterInfo, token };
          }
  
        }
      }




    }
  }
}

//LOGIN
const login = async (email, password) => {
  const SetterDetails = await SetterInfo.findOne({ email: email });
  if (!SetterDetails){
    throw new ErrorResponse("account not found", 404); 
  }
  if (SetterDetails.accountBlocked === false) {
    let comparePassword = await bcrypt.compare(password,SetterDetails.password);
    if (comparePassword) {
      let token = jwt.sign({ SetterDetails }, process.env.secretKey);
      if (token) {
        let {OTP,otpValidTill,otpVerified,password,createdAt,updatedAt,__v,...setterInfo} = SetterDetails._doc;
        return { setterInfo, token };
      } 
      else {
        throw new ErrorResponse("failed to generate token", 500);
      }
    } 
    else {
      throw new ErrorResponse("invalid credentials", 401);
    }
  } 
  else if (SetterDetails.accountBlocked === true) {
    throw new ErrorResponse("your account has been blocked", 403);
  }
  
};

// UPDATE USER : 
const update = async (id,firstname,lastname,email,username,phonenumber,dateOfBirth,gender,country,image,accountBlocked,accountMuted) => {
  let updateSetter = await SetterInfo.findByIdAndUpdate(id,{
    $set: {firstName: firstname,lastName: lastname,email: email,username: username,phonenumber: phonenumber,dateOfBirth: dateOfBirth,gender: gender,country: country,profileImage: image,accountBlocked: accountBlocked,accountMuted: accountMuted}},{ new: true });
  if (updateSetter) {
    let {OTP,otpValidTill,otpVerified,password,createdAt,updatedAt,__v,...updatedInfo} = updateSetter._doc;
    if (updateSetter.accountBlocked === true) {
      const filter = { setterId: id };
      const update = { $set: { active: false } };
      let updateGame = await GameModel.updateMany(filter, update, {
        new: true,
      });
    } 
    else if (updateSetter.accountBlocked === false) {
      const filter = { setterId: id };
      const update = { $set: { active: true } };
      let updateGame = await GameModel.updateMany(filter, update, {
        new: true,
      });
    }
    return updatedInfo;
  } 
  else {
    throw new ErrorResponse("failed to update wrong id given", 304);
  }
};

// GET SINGLE USER
const getSetter = async (id) => {
  const setter = await SetterInfo.findById(id);
  if (!setter) {
    throw new ErrorResponse("No setter found", 404);
  }
  else if (setter.accountBlocked===true){
    throw new ErrorResponse("your account has been blocked by admin", 403);
  }
  return { setterInfo: setter };
};

// TOP 5 SETTER
const topRated = async () => {
  let top = await SetterInfo.find({ accountBlocked: false,role:"setter" }).sort({ credit: -1 }).limit(20);
  if (top.length > 0) {
    return top;
  } 
  else {
    throw new ErrorResponse("no data found addsome", 404);
  }
};

// DELETE SETTER
const deleteSetter = async (id) => {
  let deleteAccount = await SetterInfo.findByIdAndDelete(id);
  if (!deleteAccount) {
    throw new ErrorResponse("wrong id no account matched", 404);
  }
  return { msg: "account deleted", status: 200 };
  
};


//FORGET PASSWORD
const forgetPassword = async (email) => {
  let findUser = await SetterInfo.findOne({ email: email });
  if (!findUser) {
    throw new ErrorResponse("wrong email. Email not found", 404);
  }
  let randomString = Math.floor(Math.random() * 9000) + 1000;
  let Updated = await SetterInfo.findOneAndUpdate({ email: email },{$set: {OTP: randomString,otpValidTill: new Date(new Date().setMinutes(new Date().getMinutes() + 5))},},{ new: true });
  if (Updated) {
    ResetPassword(findUser.firstName, email, Updated.OTP);
    return { msg: "OTP SENT TO YOUR ACCOUNT", OTP: Updated.OTP };
  } 
};

// OTP VERIFCATION
const otpVerification = async (otp) => {
  let findUser = await SetterInfo.findOne({ OTP: otp });
  if (!findUser){
    throw new ErrorResponse("wrong otp given", 404);
  }
  if (findUser.otpValidTill > Date.now()) {
    let updateVerify = await SetterInfo.findOneAndUpdate({ OTP: otp },{$set: {otpVerified: true, OTP: null, otpValidTill: null}});
    if (updateVerify) {
      return { msg: "OTP VERIFIED", sucess: true };
    } 
  } 
  else {
    let deleteOtp = await SetterInfo.findOneAndUpdate({ OTP: otp },{ $set: { OTP: null, otpValidTill: null } });
    throw new ErrorResponse("otp timeout please again call forget password api",408)
  }
};

//RESET PASSWORD
const resetPassword = async (email, password) => {
  let findUser = await SetterInfo.findOne({ email: email });
  if (!findUser){
    throw new ErrorResponse("invalid EMAIL", 404);
  }
  if (findUser.otpVerified === true) {
    let hash = await bcrypt.hash(password, 10);
    let updatePassword = await SetterInfo.findOneAndUpdate({ email: email },{$set: {password: hash,OTP: null,otpValidTill: null,otpVerified: false}},{ new: true });
    if (updatePassword) {
      return { msg: "password updated sucesfully sucesfully" };
    }
  } 
  else {
    throw new ErrorResponse("OTP NOT VERIFIED PLEASE VERIFY FIRST", 500);
  }
  
};

//CHANGE PASSWORD
const changePassword = async (id, oldpassword, newpassword) => {
  let find = await SetterInfo.findById(id);
  if(!find) {
    throw new ErrorResponse("wrong user id passed no reacord found", 404);
  }
  else if (find.accountBlocked === true) {
    throw new ErrorResponse("your account has been blocked", 403);
  } 
  else {
    let comparePassword = await bcrypt.compare(oldpassword, find.password);
    if (comparePassword) {
      let hash = await bcrypt.hash(newpassword, 10);
      let update = await SetterInfo.findByIdAndUpdate(id,{$set: {password: hash}},{ new: true });
      if (update) {
        return { msg: "password updated sucesfully" };
      }
    } 
    else {
      throw new ErrorResponse("wrong password", 401);
    }
  }
  
};


module.exports = {register,login,update,deleteSetter,forgetPassword,resetPassword,otpVerification,changePassword,topRated,getSetter,};
