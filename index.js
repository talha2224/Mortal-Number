const express = require ('express')
const cors = require('cors');
const dbConnection = require ('./Database/Connection');
const  mongoose = require('mongoose');
const dotenv = require('dotenv');
const { GameModel } = require('./Models');
const cron = require('node-cron')

const app = express()
dotenv.config()
app.use(cors({origin:'*'}))
app.use(express.json())

//PORT: 
let port = process.env.PORT || 2000

//DATABASE CONNECTION: 
mongoose.set('strictQuery', false)
dbConnection()

//MULTER SETUP
app.use("/images",express.static('./images'))


//------------------API ---------------------

//SETTER ROUTES
app.use('/api/v1/setter',require('./Routes/Setter/setterRoutes'))
app.use('/api/v1/game',require('./Routes/Setter/gameRoutes'))

//GETTER ROUTES
app.use('/api/v1/getter',require('./Routes/Getter/getterRoutes'))
app.use('/api/v1/credit',require('./Routes/Getter/creditRoutes'))

//ADMIN ROUTES
app.use('/api/v1/admin',require('./Routes/Admin/adminRoutes'))

//REWARDS
app.use('/api/v1/rewards',require('./Routes/Rewards/reward'))


//CUSTOM ERROR HANDLING
app.use(require('./Error/Error'))


cron.schedule('* * * * * *', async() => {
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
  

//PORT LISTENING:
app.listen(port,()=>console.log(`server is runing on port ${port}`))
