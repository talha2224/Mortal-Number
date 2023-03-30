const { catchAsync } = require("../../Error/Utils");
const authorized = require("../../Middleware/UserAuth");
const { CreditServices } = require("../../Services");
const router = require ('express').Router()



router.post('',authorized,catchAsync(async(req,res)=>{
    let {getterId,setterId,amount} = req.body
    let newRequest = await CreditServices.requestCredit(getterId,setterId,amount)
    res.send(newRequest)
}))

router.put('/update/:id',authorized,catchAsync(async(req,res)=>{
    let {amount,approved} = req.body
    let id = req.params.id
    let newRequest = await CreditServices.updateCredit(id,amount,approved)
    res.send(newRequest)
}))

router.delete('/:id',authorized,catchAsync(async(req,res)=>{
    let id = req.params.id
    let newRequest = await CreditServices.deleteRequest(id)
    res.send(newRequest)
}))

router.get('',catchAsync(async(req,res)=>{
    let newRequest = await CreditServices.getAll()
    res.send(newRequest)
}))

router.get('/:id',catchAsync(async(req,res)=>{
    let id = req.params.id
    let newRequest = await CreditServices.getSingle(id)
    res.send(newRequest)
}))
module.exports = router
