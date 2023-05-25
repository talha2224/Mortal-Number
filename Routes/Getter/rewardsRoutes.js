const router = require('express').Router()
const {GetterRewardsService} = require('../../Services')
const { catchAsync } = require('../../Error/Utils')

router.get('/:id',catchAsync(async(req,res)=>{
    let {id} = req.params
    let allReward = await GetterRewardsService.getRewards(id)
    res.send(allReward)
}))
module.exports = router