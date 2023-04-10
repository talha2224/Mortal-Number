const { catchAsync } = require("../../Error/Utils");
const { RewardServices } = require("../../Services");

const router = require('express').Router()

router.post('',catchAsync(async(req,res)=>{
    let {amount,won,lost,getterId,setterId} = req.body
    let postReward = await RewardServices.postReward(amount,won,lost,getterId,setterId)
    res.send(postReward)
}))

router.get('/:id',catchAsync(async(req,res)=>{
    let {id} = req.params
    let postReward = await RewardServices.getReward(id)
    res.send(postReward)
}))

router.delete('/:id',catchAsync(async(req,res)=>{
    let {id} = req.params
    let postReward = await RewardServices.deleteReward(id)
    res.send(postReward)
}))


module.exports = router