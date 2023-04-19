const joi = require('joi');

const RegisterValidation = (req,res,next)=>{
    const valid = joi.object().keys({
        firstname:joi.string().required(),
        lastname:joi.string().required(),
        email:joi.string().email().required(),
        password:joi.string().required()
    })
    const {error} = valid.validate(req.body,{abortEarly:false})
    if(error){
        res.status(401).json(error.message)
    }
    else{
        next()
    }
}

const LoginValidation = (req,res,next)=>{
    const valid = joi.object().keys({
        email:joi.string().email().required(),
        password:joi.string().required()
    })
    const {error} = valid.validate(req.body,{abortEarly:false})
    if(error){
        res.status(401).json(error.message)
    }
    else{
        next()
    }
}

const updateValidation = (req,res,next)=>{
    let valid = joi.object().keys({
        firstname:joi.string(),
        lastname:joi.string(),
        username:joi.string(),
        password:joi.string(),
        image:joi.string(),
        email:joi.string().email(),
        dateOfBirth:joi.string(),
        phonenumber:joi.string(),
        gender:joi.string(),
        country:joi.string()
    })

    let {error} = valid.validate(req.body,{abortEarly:false})
    if(error){
        res.status(401).json(error.message)
    }
    else{
        next()
    }
}




module.exports = {LoginValidation,RegisterValidation,updateValidation}