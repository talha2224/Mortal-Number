
const errorHandler = (err,req,res,next)=>{
    res.status(err.statusCode|| 500).json({
        msg:err.message || 'Server Error'
    })
}


module.exports = errorHandler