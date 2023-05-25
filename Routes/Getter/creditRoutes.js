const { catchAsync } = require("../../Error/Utils");
const authorized = require("../../Middleware/UserAuth");
const { CreditServices } = require("../../Services");
const router = require ('express').Router()



router.post('',authorized,catchAsync(async(req,res)=>{
    let {getterId, setterId, amount} = req.body
    let newRequest = await CreditServices.requestCredit(getterId, setterId, amount)
    res.send(newRequest)
}))

router.delete('/:id',authorized,catchAsync(async(req,res)=>{
    let id = req.params.id
    let newRequest = await CreditServices.deleteRequest(id)
    res.send(newRequest)
}))

router.get('',catchAsync(async(req,res)=>{
    let {getterId} = req.params
    let newRequest = await CreditServices.getAll(getterId)
    res.send(newRequest)
}))

router.get('/history/:id',catchAsync(async(req,res)=>{
    let {id} = req.params
    let history = await CreditServices.getCreditHistory(id)
    res.send(history)
}))

router.get('/:id',catchAsync(async(req,res)=>{
    let id = req.params.id
    let newRequest = await CreditServices.getSingle(id)
    res.send(newRequest)
}))

router.put('/accept/request/:requestId',catchAsync(async(req,res)=>{
    let {requestId} = req.params
    let newRequest = await CreditServices.acceptedCreditRequest(requestId)
    res.send(newRequest)
}))
module.exports = router
