const { GameModel } = require("../Models");
const cron = require("node-cron");

const gameTimer = () => {
  cron.schedule("*/1 * * * *", async () => {
    let games = await GameModel.find({ active: true });
    console.log("running");
    if (games.length) {
      for (let i = 0; i < games.length; i++) {
        if (games[i].duration.sec > 0) {
          games[i].duration.sec -= 1;
        } else if (games[i].duration.min > 0) {
          games[i].duration.sec = 59;
          games[i].duration.min -= 1;
        } else if (games[i].duration.hours > 0) {
          games[i].duration.sec = 59;
          games[i].duration.min = 59;
          games[i].duration.hours -= 1;
        } else {
          games[i].active = false;
        }
        await games[i].save();
      }
    }
    // if (findGame.length > 0) {
    //   findGame.forEach((game) => {
    //     if (game.duration.sec > 0) {
    //       game.duration.sec--;
    //     } else if (game.duration.min > 0) {
    //       game.duration.sec = 59;
    //       game.duration.min--;
    //     } else if (game.duration.hours > 0) {
    //       game.duration.sec = 59;
    //       game.duration.min = 59;
    //       game.duration.hours--;
    //     } else {
    //       // All duration fields are zero, so set active to false
    //       game.active = false;
    //     }
    //     game.save();
    //   });
    // }
  });
};

module.exports = { gameTimer };
