const { catchAsync } = require("../../Error/Utils");
const { NotificationService } = require("../../Services");
const router = require('express').Router()


router.get('/:id',catchAsync(async(req,res)=>{
    let {id} = req.params
    let postReward = await NotificationService.getReward(id)
    res.send(postReward)
}))

router.delete('/:id',catchAsync(async(req,res)=>{
    let {id} = req.params
    let postReward = await NotificationService.deleteReward(id)
    res.send(postReward)
}))

router.delete('/all',async(req,res)=>{
        let deleteall = await NotificationService.deleteMany({})
        if(deleteall){
            res.json({msg:"del"})
        }

})

module.exports = router