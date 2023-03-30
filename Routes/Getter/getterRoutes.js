const { catchAsync } = require("../../Error/Utils");
const { image_upload } = require("../../Multer/Setup");
const {GetterServices } = require("../../Services");
const { registerValidation,loginValidation } = require("../../Validation/setter/register");
const router = require('express').Router()
const authorized = require("../../Middleware/UserAuth");

// REGISTER
router.post('/register',image_upload.single('image'),registerValidation,catchAsync( async(req,res)=>{
    let {firstname,lastname,email,password} = req.body
    let image = req.file.filename
    let newSetter = await GetterServices.register(firstname,lastname,email,password,image)
    res.send(newSetter)
}))

// LOGIN
router.post('/login',loginValidation,catchAsync( async(req,res)=>{
    let {email,password} = req.body
    let loginSetter = await GetterServices.login(email,password)
    res.send(loginSetter)
}))

// UPDATE
router.put('/:id',authorized,image_upload.single('image'),catchAsync (async(req,res)=>{
    let id = req.params.id
    let image = req?.file?.filename
    let {firstname,lastname,email,password,credit} = req.body
    let updateSetter = await GetterServices.update(id,firstname,lastname,email,password,credit,image)
    res.send(updateSetter)
}))


// DELTE
router.delete('/:id',catchAsync (async(req,res)=>{
    let id = req.params.id
    let deleteAccount = await GetterServices.deleteGetter(id)
    res.send(deleteAccount)
}))


//SINGLE
router.get('/:id',catchAsync (async(req,res)=>{
    let id = req.params.id
    let single = await GetterServices.getGetter(id)
    res.send(single)
}))

//TOP ACHIEVERS
router.get('/top/rated',catchAsync(async(req,res)=>{
    let topRated = await GetterServices.topRated()
    res.send(topRated)
}))



module.exports = router