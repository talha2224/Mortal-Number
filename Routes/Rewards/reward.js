const { catchAsync } = require("../../Error/Utils");
const { RewardsModel } = require("../../Models");
const { RewardServices } = require("../../Services");

const router = require('express').Router()


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

router.delete('/all',async(req,res)=>{
        let deleteall = await RewardsModel.deleteMany({})
        if(deleteall){
            res.json({msg:"del"})
        }

})

module.exports = router