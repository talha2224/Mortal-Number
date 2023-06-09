const { catchAsync } = require("../../Error/Utils");
const { image_upload } = require("../../Multer/Setup");
const { GetterServices } = require("../../Services");
const {
  registerValidation,
  loginValidation,
} = require("../../Validation/setter/register");
const router = require("express").Router();
const authorized = require("../../Middleware/UserAuth");

// REGISTER
router.post("/register",registerValidation,catchAsync(async (req, res) => {
  let { firstname, lastname, email, password,promo,username} = req.body;
  let newSetter = await GetterServices.register(firstname,lastname,email,password,promo,username);
    res.send(newSetter);
  })
);

// LOGIN
router.post(
  "/login",
  loginValidation,
  catchAsync(async (req, res) => {
    let { email, password } = req.body;
    let loginSetter = await GetterServices.login(email, password);
    res.send(loginSetter);
  })
);

//FORGET PASSWORD
router.post(
  "/forget/password",
  catchAsync(async (req, res) => {
    let { email } = req.body;
    let forgetPassword = await GetterServices.forgetPassword(email);
    res.send(forgetPassword);
  })
);

//OTP VERIFICATION
router.post(
  "/otp/verification",
  catchAsync(async (req, res) => {
    let { otp } = req.body;
    let resetPassword = await GetterServices.otpVerification(otp);
    res.send(resetPassword);
  })
);

//RESET PASSWORD
router.post(
  "/reset/password",
  catchAsync(async (req, res) => {
    let { email, password } = req.body;
    let resetPassword = await GetterServices.resetPassword(email, password);
    res.send(resetPassword);
  })
);

// UPDATE
router.put("/:id",authorized,image_upload.single("image"),catchAsync(async (req, res) => {
    let id = req.params.id;
    const {firstname,lastname,email,username,phonenumber,dateOfBirth,gender,country,accountBlocked,accountMuted} = req.body;
    let image = req?.file?.filename;
    let updateSetter = await GetterServices.update(id,firstname,lastname,email,username,phonenumber,dateOfBirth,gender,country,image,accountBlocked,accountMuted);
    res.send(updateSetter);
  })
);

// DELETE
router.delete("/:id",authorized,catchAsync(async (req, res) => {
    let id = req.params.id;
    let deleteAccount = await GetterServices.deleteGetter(id);
    res.send(deleteAccount);
  })
);

//SINGLE
router.get("/:id",catchAsync(async (req, res) => {
    let id = req.params.id;
    let single = await GetterServices.getGetter(id);
    res.send(single);
  })
);

//TOP ACHIEVERS
router.get("/top/rated",catchAsync(async (req, res) => {
    let topRated = await GetterServices.topRated();
    res.send(topRated);
  })
);

//Update PASSWORD
router.post("/change/password",authorized,catchAsync(async (req, res) => {
    let { id, oldpassword, newpassword } = req.body;
    let resetPassword = await GetterServices.changePassword(
      id,
      oldpassword,
      newpassword
    );
    res.send(resetPassword);
  })
);

module.exports = router;
