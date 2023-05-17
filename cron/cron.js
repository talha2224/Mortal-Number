const { GameModel } = require("../Models");
const cron = require("node-cron");

const gameTimer = () => {
  cron.schedule("* * * * * *", async () => {
    let games = await GameModel.find({ active: true });
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
  });
};


module.exports = { gameTimer };
