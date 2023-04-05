const { catchAsync } = require("../../Error/Utils");
const { SetterServices } = require("../../Services");
const { registerValidation,loginValidation } = require("../../Validation/setter/register");
const router = require('express').Router()
const {image_upload} = require ('../../Multer/Setup');
const authorized = require("../../Middleware/UserAuth");


router.post('/register',registerValidation,catchAsync( async(req,res)=>{
    let {firstname,lastname,email,password} = req.body
    let newSetter = await SetterServices.register(firstname,lastname,email,password)
    res.send(newSetter)
}))

router.post('/login',loginValidation,catchAsync( async(req,res)=>{
    let {email,password} = req.body
    let loginSetter = await SetterServices.login(email,password)
    res.send(loginSetter)
}))
// router.get('/:id')
router.put('/:id',authorized,catchAsync(async(req,res)=>{
    let id = req.params.id
    let {firstname,lastname,email,password,credit} = req.body
    let updateSetter = await SetterServices.update(id,firstname,lastname,email,password,credit)
    res.send(updateSetter)
}))

router.delete('/:id',authorized,catchAsync (async(req,res)=>{
    let id = req.params.id
    let deleteAccount = await SetterServices.deleteSetter(id)
    res.send(deleteAccount)
}))



module.exports = router
