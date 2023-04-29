const { GameModel } = require('../Models');
const cron = require('node-cron');

const gameTimer =()=>{
    cron.schedule('* * * * * *',async() => {
        let findGame = await GameModel.find({active:true})
        if (findGame.length>0){ 
            findGame.forEach((game) => {
                console.log(game)
                if (game.duration.sec > 0) {
                  game.duration.sec--;
                } else if (game.duration.min > 0) {
                  game.duration.sec = 59;
                  game.duration.min--;
                } else if (game.duration.hours > 0) {
                  game.duration.sec = 59;
                  game.duration.min = 59;
                  game.duration.hours--;
                } else {
                  // All duration fields are zero, so set active to false
                  game.active = false;
                }
                game.save()
              });
        }
    });
}

module.exports = {gameTimer}