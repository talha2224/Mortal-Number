const router = require ('express').Router()

const { catchAsync } = require('../../Error/Utils')
const {RewardService} = require('../../Services')

router.get('/:id',catchAsync(async(req,res)=>{
    let allReward = await RewardService.getRewards(id)
    res.send(allReward)
}))
    
module.exports = router