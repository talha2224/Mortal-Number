const router = require('express').Router()
const { catchAsync } = require('../../Error/Utils')
const authorized = require('../../Middleware/UserAuth')
const { GuesserDeviceService } = require('../../Services')

router.post('',authorized,catchAsync(async(req,res)=>{
    let {deviceToken,device,guesserId} = req.body
    let postDeviceToken = await GuesserDeviceService.postDeviceToken(deviceToken,device,guesserId)
    res.send(postDeviceToken)
}))
module.exports = router