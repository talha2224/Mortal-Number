const router = require('express').Router()
const { catchAsync } = require('../../Error/Utils')
const authorized = require('../../Middleware/UserAuth')
const { SetterDeviceService } = require('../../Services')

router.post('',authorized,catchAsync(async(req,res)=>{
    let {deviceToken,device,setterId} = req.body
    let postDeviceToken = await SetterDeviceService.postDeviceToken(deviceToken,device,setterId)
    res.send(postDeviceToken)
}))

module.exports = router