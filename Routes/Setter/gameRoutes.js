const { catchAsync } = require('../../Error/Utils')
const authorized = require('../../Middleware/UserAuth')
const { GameServices } = require('../../Services')
const { GameValidation } = require('../../Validation/setter/gameValidation')

const router = require('express').Router()

router.post('',[authorized,GameValidation] ,catchAsync( async(req,res)=>{
    let {id,winningnumber,stake,prize,hours,minutes,seconds} = req.body
    let game = await GameServices.postGame(id,winningnumber,stake,prize,hours,minutes,seconds)
    res.send(game)
}))

router.get('',catchAsync(async(req,res)=>{
    let allGame = await GameServices.getGame()
    res.send(allGame)
}))

router.get('/:id',catchAsync(async(req,res)=>{
    let id = req.params.id
    let singleGame = await GameServices.singleGame(id)
    res.send(singleGame)
}))

router.delete('/:id',authorized,catchAsync(async(req,res)=>{
    let id = req.params.id
    let deletedGame = await GameServices.deleteGame(id)
    res.send(deletedGame)
}))

router.put('/:id',authorized,catchAsync(async(req,res)=>{
    let {winningnumber,deletewinningnumber,stake,prize,winners,deleteWinner} = req.body
    let id = req.params.id
    let updateGame = await GameServices.updateGame(id,winningnumber,deletewinningnumber,stake,prize,winners,deleteWinner)
    res.send(updateGame)
}))

router.get('/:getterid/:gameid',catchAsync(async(req,res)=>{
    let {getterid,gameid} = req.params
    let game = await GameServices.playGame(getterid,gameid)
    res.send(game)
}))


router.post('/game/result',catchAsync(async(req,res)=>{
    let {getterid,gameid,win} = req.body
    let game = await GameServices.afterGame(getterid,gameid,win)
    res.send(game)
}))

module.exports = router