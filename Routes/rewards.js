const router = require ('express').Router()

const {Rewards} = require('../Models/Rewards/Rewards')


router.get('/:id',async(req,res)=>{
    let {id} = req.params
    
    let getAll = await Rewards.find({$or: [{ getterId:id },{ setterId: id }]})
    if (getAll.length>0){
        return getAll
    }
    return {msg:" No rewards Found"}
})
    
module.exports = router