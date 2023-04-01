const joi = require ('joi')

const GameValidation = async(req,res,next)=>{
    const validate = joi.object().keys({
        id:joi.string().required(),
        winningnumber:joi.array().required(),
        stake:joi.number().required(),
        prize:joi.number().required(),
        hours:joi.number().required(),
        minutes:joi.number().required(),
        seconds:joi.number().required(),
    })
    let {error} = validate.validate(req.body,{abortEarly:false})
    if (!error){
        next()
    }
    else{
        res.status(404).json({error:error.message})
    }
}

module.exports = {GameValidation}


