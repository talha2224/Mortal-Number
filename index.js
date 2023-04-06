const express = require ('express')
const cors = require('cors');
const dbConnection = require ('./Database/Connection');
const  mongoose = require('mongoose');
const dotenv = require('dotenv')



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
app.use('/api/v1/profile/setter',require('./Routes/Setter/profileRoutes'))

//GETTER ROUTES
app.use('/api/v1/getter',require('./Routes/Getter/getterRoutes'))
app.use('/api/v1/credit',require('./Routes/Getter/creditRoutes'))
app.use('/api/v1/profile/getter',require('./Routes/Getter/profileRoutes'))

//ADMIN ROUTES
app.use('/api/v1/admin',require('./Routes/Admin/adminRoutes'))


//CUSTOM ERROR HANDLING
app.use(require('./Error/Error'))

//PORT LISTENING:
app.listen(port,()=>console.log(`server is runing on port ${port}`))
