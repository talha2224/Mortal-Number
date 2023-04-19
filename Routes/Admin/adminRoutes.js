const { catchAsync } = require('../../Error/Utils')
const { AdminServices } = require('../../Services')
const {image_upload}  = require ('../../Multer/Setup')
const authorized = require('../../Middleware/AdminAuth')
const router = require('express').Router()

router.post('',catchAsync(async(req,res)=>{
    let {firstname,lastname,email,password} = req.body
    let image = req.file.filename
    let createAdmin = await AdminServices.registerAdmin(firstname,lastname,email,password,image)
    res.send(createAdmin)
}))

router.post('/login',catchAsync(async(req,res)=>{
    let {email,password} = req.body
    let loginAdmin = await AdminServices.loginAdmin(email,password)
    res.send(loginAdmin)
}))

router.get('/:id',catchAsync(async(req,res)=>{
    let id = req.params.id
    let getAdmin = await AdminServices.getAdmin(id)
    res.send(getAdmin)
}))

router.put('/:id',authorized,image_upload.single('image'),catchAsync(async(req,res)=>{
    let {firstname,lastname,email,password,username,phonenumber,credit,dateOfBirth,gender,country} = req.body
    let image = req?.file?.filename
    let id = req.params.id
    let updateAdmin = await AdminServices.updateAdmin(id,firstname,lastname,email,password,username,phonenumber,credit,dateOfBirth,gender,country)
    res.send(updateAdmin)
}))

router.delete('/:id',authorized,catchAsync(async(req,res)=>{
    let id = req.params.id
    let deleteAdmin = await AdminServices.deleteAdmin(id)
    res.send(deleteAdmin)
}))
module.exports = router