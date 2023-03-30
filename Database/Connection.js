const mongoose = require('mongoose');

const dbConnection = ()=>{
    let connection = mongoose.connect(process.env.mongooUrl)
    if(!connection){
        console.log('database connection failed')
    }
}

module.exports = dbConnection