
const errorHandler = (err,req,res,next)=>{
    res.status(err.statusCode|| 500).json({
        msg:err.message || 'Server Error'
    })
    console.log(err.message,err.statusCode,'ERROR .JS ')
}


module.exports = errorHandler