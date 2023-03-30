const jwt = require ("jsonwebtoken")

const authorized=(req,res,next)=>{
    const token = req.headers['adminauth']
    if(token){
        let verify = jwt.verify(token,process.env.adminKey)
        if (verify){
            next()
        }
        else{
            res.status(401).json({msg:"INVALID TOKEN YOU CANNOT ACCESS THIS API"})
        }
    }
    else{
        res.status(404).json({msg:"AUTH TOKEN IS REQUIRED"})
    }
}

module.exports =authorized