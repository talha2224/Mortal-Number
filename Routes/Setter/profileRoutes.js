
const { catchAsync } = require("../../Error/Utils");
const { image_upload } = require("../../Multer/Setup");
const { SetterProfileServices } = require("../../Services");
const router = require('express').Router()
// const authorized = require("../../Middleware/UserAuth");


router.post('/',image_upload.single('image'),catchAsync(async(req,res)=>{
    let {accountId,name,email,phone,dateOfBirth,gender,country} = req.body
    let image = req?.file?.filename;
    let postProfile = await SetterProfileServices.postProfile(accountId,name,email,phone,dateOfBirth,gender,country,image)
    res.send(postProfile)
}))


router.get('/:accountId',catchAsync (async(req,res)=>{
    let {accountId} = req.params
    let find = await SetterProfileServices.getProfile(accountId)
    res.send(find)
}))




router.put('/:id',image_upload.single('image'),catchAsync(async(req,res)=>{
    let {name,email,phone,dateOfBirth,gender,country,credit} = req.body
    let {id} = req.params
    let image = req?.file?.filename;
    let updateProfile = await SetterProfileServices.updateProfile(id,name,email,phone,dateOfBirth,gender,country,image,credit)
    res.send(updateProfile)
}))

module.exports = router