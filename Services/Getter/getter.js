const {ErrorResponse} = require("../../Error/Utils");
const { GetterRegisterModel } = require("../../Models");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const randomstring = require('randomstring')


//RESET PASSWORD EMAIL

const ResetPassword =(name,email,otp)=>{
    try {
        const transporter=nodemailer.createTransport({service:"gmail",auth:{
            user:'talhahaider074@gmail.com',
            pass:'bwmcuysleqrlcemu'
        }});
        const mailOptions = {
            from:'talhahaider074@gmail.com',
            to:email,
            subject:"RESET PASSWORD EMAIL",
            html:`<p> Hi ${name} this is your reset password code ${otp}</p>`
        }
        transporter.sendMail(mailOptions,function(err,info){
            if(err){
                console.log(err)
            }
            else{
                console.log('mail send',info.response)
            }
        })
    } 

    catch (error) {
        console.log(error)
    }
}
// REGITSER
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

//LOGIN
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

//FORGET PASSWORD 
const forgetPassword = async (email)=>{
    try {
        let findUser = await GetterRegisterModel.findOne({email:email})

        if(findUser){
           let randomString= Math.floor(Math.random() * 9000) + 1000;
           let Updated = await GetterRegisterModel.findOneAndUpdate({email:email},{
            $set:{
                OTP:randomString
            }
           },{new:true})
           if(Updated){
                ResetPassword(findUser.firstName,email,Updated.OTP)
                return {msg:'OTP SENT TO YOUR ACCOUNT',randomString}
           }
        }
        else{
            throw new ErrorResponse("wrong email. Email not found",404)
        }
    } 
    catch (error) {
        throw new ErrorResponse(error,404)
    }
}

//RESET PASSWORD
const resetPassword = async (otp,password)=>{
    try {
        let findUser = await GetterRegisterModel.findOne({OTP:otp})
        if(findUser){
            let hash =await bcrypt.hash(password,10)
            let updatePassword = await GetterRegisterModel.findOneAndUpdate({OTP:otp},{$set:{
                password:hash,
                OTP:''
            }})
            if(updatePassword){
                return {msg:"password updated sucesfully sucesfully"}
            }
        }
        else{
            throw new ErrorResponse('invalid OTP',404)
        }
    } 
    catch (error) {
        throw new ErrorResponse(error.message,404)
    }
}

//GET GETTER
const getGetter =  async(id)=>{
    let singleGetter = await GetterRegisterModel.findById(id)
    if (singleGetter){
        return singleGetter
    }
    else{
        throw new ErrorResponse('Invalid Id ',404)
    }
}

//UPDATE GETTER PROFILE
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


//DELETE GETTER
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

//TOP 5 GETTER
const topRated = async()=>{
    try {
        let top = await GetterRegisterModel.find({}).sort({credit:-1}).limit(5)
        if (top){
            return top
        }
        else{
            throw new ErrorResponse('no data found addsome',404)
        }
        
    } catch (error) {
        throw new ErrorResponse(error.message)
    }
}

module.exports = {register,login,update,deleteGetter,getGetter,topRated,forgetPassword,resetPassword}