const { ErrorResponse } = require("../../Error/Utils");
const { GetterRegisterModel } = require("../../Models");
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

// REGITSER
const register = async (firstname, lastname, email, password) => {
  const findGetter = await GetterRegisterModel.findOne({ email: email });
  if (findGetter) {
    throw new ErrorResponse("email already registered", 403);
  } else {
    let hash = await bcrypt.hash(password, 10);
    let getter = await GetterRegisterModel.create({
      firstName: firstname,
      lastName: lastname,
      email: email,
      password: hash,
      credit: 500,
    });
    if (getter) {
      let token = jwt.sign({ getter }, process.env.secretKey);
      if (token) {
        let {
          OTP,
          otpValidTill,
          otpVerified,
          password,
          createdAt,
          updatedAt,
          __v,
          ...getterInfo
        } = getter._doc;
        return { getterInfo, token };
      } else {
        throw new ErrorResponse("Failed To Generate Token", 400);
      }
    } else {
      throw new ErrorResponse("Failed to create User", 400);
    }
  }
};

//LOGIN
const login = async (email, password) => {
  const loginGetter = await GetterRegisterModel.findOne({ email: email });
  if (loginGetter) {
    if (loginGetter.accountBlocked === false) {
      let comparePassword = await bcrypt.compare(
        password,
        loginGetter.password
      );
      if (comparePassword) {
        let token = jwt.sign({ loginGetter }, process.env.secretKey);
        if (token) {
          let {
            OTP,
            otpValidTill,
            otpVerified,
            password,
            createdAt,
            updatedAt,
            __v,
            ...getterInfo
          } = loginGetter._doc;
          return { getterInfo, token };
        } else {
          throw new ErrorResponse("failed to generate token", 500);
        }
      } else {
        throw new ErrorResponse("invalid credentials", 400);
      }
    } else if (loginGetter.accountBlocked === true) {
      throw new ErrorResponse("your account has been blocked", 403);
    }
  } else {
    throw new ErrorResponse("account not found", 404);
  }
};

//FORGET PASSWORD
const forgetPassword = async (email) => {
  let findUser = await GetterRegisterModel.findOne({ email: email });
  if (findUser) {
    let randomString = Math.floor(Math.random() * 9000) + 1000;
    let Updated = await GetterRegisterModel.findOneAndUpdate(
      { email: email },
      {
        $set: {
          OTP: randomString,
          otpValidTill: new Date(
            new Date().setMinutes(new Date().getMinutes() + 5)
          ),
        },
      },
      { new: true }
    );
    if (Updated) {
      ResetPassword(findUser.firstName, email, Updated.OTP);
      return { msg: "OTP SENT TO YOUR ACCOUNT", otp: Updated.OTP };
    }
  } else {
    throw new ErrorResponse("wrong email. Email not found", 404);
  }
};

// OTP VERIFCATION
const otpVerification = async (otp) => {
  let findUser = await GetterRegisterModel.findOne({ OTP: otp });
  if (findUser) {
    if (findUser.otpValidTill > Date.now()) {
      let updateVerify = await GetterRegisterModel.findOneAndUpdate(
        { OTP: otp },
        {
          $set: {
            otpVerified: true,
          },
        }
      );
      if (updateVerify) {
        return { msg: "OTP VERIFIED", sucess: true };
      } else {
        return { msg: "OTP NOT VERIFIED", sucess: false, status: 500 };
      }
    } else {
      let deleteOtp = await GetterRegisterModel.findOneAndUpdate(
        { OTP: otp },
        {
          $set: {
            OTP: null,
            otpValidTill: null,
          },
        }
      );
      throw new ErrorResponse(
        "otp timeout please again call forget password api",
        408
      );
    }
  } else {
    throw new ErrorResponse("wrong otp given", 404);
  }
};

//RESET PASSWORD
const resetPassword = async (email, password) => {
  let findUser = await GetterRegisterModel.findOne({ email: email });
  if (findUser) {
    if (findUser.otpVerified === true) {
      let hash = await bcrypt.hash(password, 10);
      let updatePassword = await GetterRegisterModel.findOneAndUpdate(
        { email: email },
        {
          $set: {
            password: hash,
            OTP: null,
            otpValidTill: null,
            otpVerified: false,
          },
        }
      );
      if (updatePassword) {
        return { msg: "password updated sucesfully sucesfully" };
      }
    } else {
      throw new ErrorResponse("otp not verified please verified first", 500);
    }
  } else {
    throw new ErrorResponse("invalid OTP", 404);
  }
};

//GET GETTER
const getGetter = async (id) => {
  let singleGetter = await GetterRegisterModel.findById(id);
  if (singleGetter) {
    let {
      OTP,
      otpValidTill,
      otpVerified,
      createdAt,
      password,
      updatedAt,
      __v,
      ...getterInfo
    } = singleGetter._doc;
    return { getterInfo };
  } else {
    throw new ErrorResponse("Invalid Id ", 404);
  }
};

//UPDATE GETTER PROFILE
const update = async (id, body) => {
  let getter = await GetterRegisterModel.findById(id);
  if (!getter) {
    throw new ErrorResponse("user not found", 404);
  }
  Object.assign(getter, body);
  return await getter.save();
};

//DELETE GETTER
const deleteGetter = async (id) => {
  if (id) {
    let deleteAccount = await GetterRegisterModel.findByIdAndDelete(id);
    if (deleteAccount) {
      return { msg: "account deleted", status: 200 };
    } else {
      throw new ErrorResponse("wrong id no account matched", 404);
    }
  } else {
    throw new ErrorResponse("id is required", 404);
  }
};

//TOP 5 GETTER
const topRated = async () => {
  let top = await GetterRegisterModel.find({}).sort({ credit: -1 }).limit(5);
  if (top) {
    return top;
  } else {
    throw new ErrorResponse("no data found addsome", 404);
  }
};

//CHANGE PASSWORD
const changePassword = async (id, oldpassword, newpassword) => {
  let find = await GetterRegisterModel.findById(id);
  if (find) {
    let comparePassword = await bcrypt.compare(oldpassword, find.password);
    if (comparePassword) {
      let hash = await bcrypt.hash(newpassword, 10);
      let update = await GetterRegisterModel.findByIdAndUpdate(
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
  let findUserAndUpdate = await GetterRegisterModel.findByIdAndUpdate(id, {
    $set: {
      accountBlocked: true,
    },
  });
  if (findUserAndUpdate) {
    return { msg: "YOUR ACCOUNT HAS BEEN BLOCKED" };
  } else {
    throw new ErrorResponse("WRONG ID GIVEN FAILED TO BLOCK GUESSER", 404);
  }
};

module.exports = {
  register,
  login,
  update,
  deleteGetter,
  getGetter,
  topRated,
  forgetPassword,
  resetPassword,
  otpVerification,
  changePassword,
  blockUser,
};
