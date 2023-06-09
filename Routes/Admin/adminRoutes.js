const { catchAsync } = require('../../Error/Utils')
const { AdminServices } = require('../../Services')
const {image_upload}  = require ('../../Multer/Setup')
const authorized = require('../../Middleware/AdminAuth')
const { LoginValidation,RegisterValidation,updateValidation} = require('../../Validation/admin/RegisterLoginValidation')
const router = require('express').Router()

router.post('',RegisterValidation,catchAsync(async(req,res)=>{
    let {firstname,lastname,email,password} = req.body
    console.log(firstname,lastname,email,password)
    let createAdmin = await AdminServices.registerAdmin(firstname,lastname,email,password)
    res.send(createAdmin)
}))

router.post('/login',LoginValidation,catchAsync(async(req,res)=>{
    let {email,password} = req.body
    let loginAdmin = await AdminServices.loginAdmin(email,password)
    res.send(loginAdmin)
}))

router.get('/:id',catchAsync(async(req,res)=>{
    let id = req.params.id
    let getAdmin = await AdminServices.getAdmin(id)
    res.send(getAdmin)
}))

router.put('/:id',[authorized,updateValidation],image_upload.single('image'),catchAsync(async(req,res)=>{
    let id = req.params.id
    let {body} = req
    if (req.file){
        body.image = req.file.filename
    }
    let updateAdmin = await AdminServices.updateAdmin(id,body)
    res.send(updateAdmin)
}))

//FORGET PASSWORD
router.post('/forget/password',catchAsync(async(req,res)=>{
    let {email} = req.body
    let forgetPassword = await AdminServices.forgetPassword(email)
    res.send(forgetPassword)
}))
//OTP VERIFICATION
router.post('/otp/verification',catchAsync(async(req,res)=>{
    let {otp} = req.body
    let resetPassword = await AdminServices.otpVerification(otp)
    res.send(resetPassword)
}))
//RESET PASSWORD
router.post('/reset/password',catchAsync(async(req,res)=>{
    let {email,password} = req.body
    let resetPassword = await AdminServices.resetPassword(email,password)
    res.send(resetPassword)
}))

router.delete('/:id',authorized,catchAsync(async(req,res)=>{
    let id = req.params.id
    let deleteAdmin = await AdminServices.deleteAdmin(id)
    res.send(deleteAdmin)
}))

//Update PASSWORD
router.post('/change/password',authorized,catchAsync(async(req,res)=>{
    let {id,oldpassword,newpassword} = req.body
    let resetPassword = await AdminServices.changePassword(id,oldpassword,newpassword)
    res.send(resetPassword)
}))


module.exports = router