const {ErrorResponse} = require("../../Error/Utils");
const { GetterRegisterModel } = require("../../Models");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const register = async(firstname,lastname,email,password)=>{
    const findGetter = await GetterRegisterModel.findOne({email:email})
    if(findGetter){
        throw new ErrorResponse('email already registered',403)
    }
    else{ 
        try {
            let hash = await bcrypt.hash(password,10)
            let getter = await GetterRegisterModel.create({firstName:firstname,lastName:lastname,email:email,password:hash,credit:500})
            if(getter){
                let token = jwt.sign({getter},process.env.secretKey)
                if(token){
                    return {getter,token}
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
            console.log(error)
           throw new  ErrorResponse (error,400) 
        }
    }
}

const login = async(email,password)=>{
    const loginGetter = await GetterRegisterModel.findOne({email:email})
    if(loginGetter){
        try{
           let comparePassword = await bcrypt.compare(password,loginGetter.password)
           if(comparePassword){
                let token = jwt.sign({loginGetter},process.env.secretKey)
                if(token){
                return {loginGetter,token}
                }
                else{
                throw new ErrorResponse('failed to generate token',500)
                }
            } 
            else{
                throw new ErrorResponse ("invalid credentials",400)
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
//Forgot Password
const forgotPassword = async (email,password)=>{
    console.log(email,password)
    try {
        const isFound = await GetterRegisterModel.findOne({email:email})
        if(isFound){
            let hasPassword = await bcrypt.hash(password,10)
            let updatedInfo = await GetterRegisterModel.findByIdAndUpdate(isFound._id,{$set:{
                password:hasPassword
            }},{new:true})
            return updatedInfo
        //     if(updatedInfo){
        //         return updatedInfo
        //     }
        //     if(updatedInfo){
        //         let token = jwt.sign({updatedInfo},process.env.secretKey)
        //         if(token){
        //         return {updatedInfo,token}
        //         }
        //         else{
        //         throw new ErrorResponse('failed to generate token',500)
        //         }
        //     }
        // }
        // else{ 
        //     throw new ErrorResponse('wrong email',404)
        }
    } catch (error) {
        throw new ErrorResponse('wrong email',404)
    }
}


const getGetter =  async(id)=>{
    let singleGetter = await GetterRegisterModel.findById(id)
    if (singleGetter){
        return singleGetter
    }
    else{
        throw new ErrorResponse('Invalid Id ',404)
    }
}

const update = async(id,firstname,lastname,email,password,username,phonenumber,credit,dateOfBirth,gender,country,image)=>{
    if (password){
        try {
            let hash = await bcrypt.hash(password,10)
            let updateGetter = await GetterRegisterModel.findByIdAndUpdate(id,
                {
                    $set:{
                        firstName:firstname,
                        lastName:lastname,
                        email:email,
                        password:hash,
                        username:username,
                        phonenumber:phonenumber,
                        credit:credit,
                        dateOfBirth:dateOfBirth,
                        gender:gender,
                        country:country,
                        profileImage:image
                    }
                },
                {new:true}
            )
            if(updateGetter){
                return updateGetter
            }
            else{
                throw new ErrorResponse("failed to update",409)
            }
            
        } 
        catch (error) {
            throw new ErrorResponse(error,500)
        }
    }

    else{
        try {
            let updateGetter = await GetterRegisterModel.findByIdAndUpdate(id,
                {
                    $set:{
                        firstName:firstname,
                        lastName:lastname,
                        email:email,
                        username:username,
                        phonenumber:phonenumber,
                        credit:credit,
                        dateOfBirth:dateOfBirth,
                        gender:gender,
                        country:country,
                        profileImage:image
                    }
                },
                {new:true}
            )
            if(updateGetter){
                return updateGetter
            }
            else{
                throw new ErrorResponse("failed to update",409)
            }
            
        } 
        catch (error) {
            throw new ErrorResponse(error,500) 
        }
    }
}

const deleteGetter = async(id)=>{
    if (id){
        try {
           let deleteAccount = await GetterRegisterModel.findByIdAndDelete(id)
           if(deleteAccount){
            return {msg:"account deleted",status:200}
           } 
           else{
            throw new ErrorResponse('wrong id no account matched',404)
           }
        }
        catch (error) {
            throw new ErrorResponse(error,404)
        }
    }
    else{
        throw new ErrorResponse("id is required",404)
    }

}

//Top Rated getter
const topRated = async()=>{
    let top = await GetterRegisterModel.find({}).sort({credit:-1}).limit(5)
    if (top){
        return top
    }
    throw new ErrorResponse("no user found please add some",404)
}

module.exports = {register,login,update,deleteGetter,getGetter,topRated,forgotPassword}