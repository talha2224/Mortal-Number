const { catchAsync } = require('../../Error/Utils')
const { SetterNotification } = require('../../Services')

const router = require ('express').Router()

router.get("/:id",catchAsync(async(req,res)=>{
    let {id} = req.params
    let notification = await SetterNotification.getSetterNotification(id)
    res.send(notification)
}))
module.exports= router