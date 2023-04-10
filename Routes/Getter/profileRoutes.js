const { catchAsync } = require("../../Error/Utils");
const { image_upload } = require("../../Multer/Setup");
const {ProfileServices } = require("../../Services");
const router = require('express').Router()
// const authorized = require("../../Middleware/UserAuth");


router.post('/',image_upload.single('image'),catchAsync(async(req,res)=>{
    let {accountId,name,email,phone,dateOfBirth,gender,country} = req.body
    let image = req?.file?.filename;
    let postProfile = await ProfileServices.postProfile(accountId,name,email,phone,dateOfBirth,gender,country,image)
    res.send(postProfile)
}))


router.get('/:accountId',catchAsync (async(req,res)=>{
    let {accountId} = req.params
    let find = await ProfileServices.getProfile(accountId)
    res.send(find)
}))


//TOP ACHIEVERS
router.get('/top/rated',catchAsync(async(req,res)=>{
    let topRated = await ProfileServices.topRated()
    res.send(topRated)
}))



router.put('/:id',image_upload.single('image'),catchAsync(async(req,res)=>{
    let {name,email,phone,dateOfBirth,gender,country,credit} = req.body
    let {id} = req.params
    let image = req?.file?.filename;
    let updateProfile = await ProfileServices.updateProfile(id,name,email,phone,dateOfBirth,gender,country,image,credit)
    res.send(updateProfile)
}))
















module.exports = router