const {ErrorResponse} = require("../../Error/Utils");
const { SetterRegisterModel } = require("../../Models");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const register = async(firstname,lastname,email,password,image)=>{
    const findSetter = await SetterRegisterModel.findOne({email:email})
    if(findSetter){
        throw new ErrorResponse('email already registered',403)
    }
    else{ 
        try {
            let hash = await bcrypt.hash(password,10)
            let setter = await SetterRegisterModel.create({firstName:firstname,lastName:lastname,email:email,password:hash,credit:500,profileImage:image})
            if(setter){
                let token = jwt.sign({setter},process.env.secretKey)
                if(token){
                    return {setter,token}
                }
                else{
                    throw new ErrorResponse('Failed To Generate Token',400)
                }
            }
            else{
                throw new ErrorResponse('Failed to create User',400)
            }
        } 
        catch (error) {
           throw new  ErrorResponse (error,400) 
        }
    }
}

const login = async(email,password)=>{
    const loginSetter = await SetterRegisterModel.findOne({email:email})
    if(loginSetter){
        try{
           let comparePassword = await bcrypt.compare(password,loginSetter.password)
           if(comparePassword){
                let token = jwt.sign({loginSetter},process.env.secretKey)
                if(token){
                return {loginSetter,token}
                }
                else{
                throw new ErrorResponse('failed to generate token',500)
                }
            } 
            else{
                throw new ErrorResponse ("invalid credentials",401)
            }
        }

        catch (error) {
            throw new ErrorResponse(error,500)
        }
    }
    else{ 
        throw new ErrorResponse('account not found',404)
    }
}

const update = async(id,firstname,lastname,email,password,credit,image)=>{
    if (password){
        try {
            let hash = await bcrypt.hash(password,10)
            let updateSetter = await SetterRegisterModel.findByIdAndUpdate(id,
                {
                    $set:{
                        firstName:firstname,
                        lastName:lastname,
                        email:email,
                        password:hash,
                        credit:credit,
                        profileImage:image
                    }
                },
                {new:true}
            )
            if(updateSetter){
                return updateSetter
            }
            else{
                throw new ErrorResponse("failed to update",304)
            }
            
        } 
        catch (error) {
            throw new ErrorResponse(error,304)
        }
    }
    else{
        try {
            let updateSetter = await SetterRegisterModel.findByIdAndUpdate(id,
                {
                    $set:{
                        firstName:firstname,
                        lastName:lastname,
                        email:email,
                        credit:credit,
                        profileImage:image
                    }
                },
                {new:true}
            )
            if(updateSetter){
                return updateSetter
            }
            else{
                throw new ErrorResponse("failed to update",304)
            }
            
        } 
        catch (error) {
            throw new ErrorResponse(error,304) 
        }
    }
}

const deleteSetter = async(id)=>{
    if (id){
        try {
           let deleteAccount = await SetterRegisterModel.findByIdAndDelete(id)
           if(deleteAccount){
            return {msg:"account deleted",status:200}
           } 
           else{
            throw new ErrorResponse('wrong id no account matched',404)
           }
        }
        catch (error) {
            throw new ErrorResponse(error,500)
        }
    }
    else{
        throw new ErrorResponse("id is required",404)
    }

}
module.exports = {register,login,update,deleteSetter}

