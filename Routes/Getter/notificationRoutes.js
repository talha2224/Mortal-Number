const { catchAsync } = require('../../Error/Utils')
const { GuesserNotification } = require('../../Services')

const router = require ('express').Router()

router.get("/:id",catchAsync(async(req,res)=>{
    let {id} = req.params

    let notification = await GuesserNotification.getGetterNotification(id)
    res.send(notification)
}))
module.exports= router