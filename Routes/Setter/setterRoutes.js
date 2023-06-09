const { catchAsync } = require("../../Error/Utils");
const { SetterServices } = require("../../Services");
const {registerValidation,loginValidation,} = require("../../Validation/setter/register");
const router = require("express").Router();
const { image_upload } = require("../../Multer/Setup");
const authorized = require("../../Middleware/UserAuth");

router.post("/register",registerValidation,catchAsync(async (req, res) => {
    let { firstname, lastname, email, password,promo,username } = req.body;
    let newSetter = await SetterServices.register(firstname,lastname,email,password,promo,username);
    res.send(newSetter);
  })
);

router.post(
  "/login",
  loginValidation,
  catchAsync(async (req, res) => {
    let { email, password } = req.body;
    let loginSetter = await SetterServices.login(email, password);
    res.send(loginSetter);
  })
);

router.put("/:id",authorized,image_upload.single("image"),catchAsync(async (req, res) => {
  let { id } = req.params;
  const {firstname,lastname,email,username,phonenumber,dateOfBirth,gender,country,accountBlocked,accountMuted} = req.body;
    let image = req?.file?.filename;
    let updateSetter = await SetterServices.update(id,firstname,lastname,email,username,phonenumber,dateOfBirth,gender,country,image,accountBlocked,accountMuted);
    res.send(updateSetter);
  })
);

//FORGET PASSWORD
router.post(
  "/forget/password",
  catchAsync(async (req, res) => {
    let { email } = req.body;
    let forgetPassword = await SetterServices.forgetPassword(email);
    res.send(forgetPassword);
  })
);

//OTP VERIFICATION
router.post(
  "/otp/verification",
  catchAsync(async (req, res) => {
    let { otp } = req.body;
    let resetPassword = await SetterServices.otpVerification(otp);
    res.send(resetPassword);
  })
);

//RESET PASSWORD
router.post(
  "/reset/password",
  catchAsync(async (req, res) => {
    let { email, password } = req.body;
    let resetPassword = await SetterServices.resetPassword(email, password);
    res.send(resetPassword);
  })
);

router.delete(
  "/:id",
  authorized,
  catchAsync(async (req, res) => {
    let id = req.params.id;
    let deleteAccount = await SetterServices.deleteSetter(id);
    res.send(deleteAccount);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    let id = req.params.id;
    let setter = await SetterServices.getSetter(id);
    res.send(setter);
  })
);

//Update PASSWORD
router.post(
  "/change/password",
  authorized,
  catchAsync(async (req, res) => {
    let { id, oldpassword, newpassword } = req.body;
    let resetPassword = await SetterServices.changePassword(
      id,
      oldpassword,
      newpassword
    );
    res.send(resetPassword);
  })
);

//TOP ACHIEVERS
router.get(
  "/top/rated",
  catchAsync(async (req, res) => {
    let topRated = await SetterServices.topRated();
    res.send(topRated);
  })
);

module.exports = router;
