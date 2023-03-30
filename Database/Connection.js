const mongoose = require('mongoose');

const dbConnection = ()=>{
    let connection = mongoose.connect('mongodb+srv://talhahaider:XnbdEFFxMJMSGZSf@mortalnumbercluster.8nd5mtv.mongodb.net/?retryWrites=true&w=majority')
    if(!connection){
        console.log('database connection failed')
    }
}

module.exports = dbConnection