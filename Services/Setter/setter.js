const {ErrorResponse} = require("../../Error/Utils");
const { SetterRegisterModel } = require("../../Models");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");


//NODE MAILER CONFIGURATION
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

const register = async(firstname,lastname,email,password)=>{
    const findSetter = await SetterRegisterModel.findOne({email:email})
    if(findSetter){
        throw new ErrorResponse('email already registered',403)
    }
    else{ 
        try {
            let hash = await bcrypt.hash(password,10)
            let setter = await SetterRegisterModel.create({firstName:firstname,lastName:lastname,email:email,password:hash,credit:500})
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
    const SetterDetails = await SetterRegisterModel.findOne({email:email})
    if(SetterDetails){
        try{
           let comparePassword = await bcrypt.compare(password,SetterDetails.password)
           if(comparePassword){
                let token = jwt.sign({SetterDetails},process.env.secretKey)
                if(token){
                return {SetterDetails,token}
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
//FORGET PASSWORD 
const forgetPassword = async (email)=>{
    try {
        let findUser = await SetterRegisterModel.findOne({email:email})

        if(findUser){
           let randomString= Math.floor(Math.random() * 9000) + 1000;
           let Updated = await SetterRegisterModel.findOneAndUpdate({email:email},{
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
        let findUser = await SetterRegisterModel.findOne({OTP:otp})
        if(findUser){
            let hash =await bcrypt.hash(password,10)
            let updatePassword = await SetterRegisterModel.findOneAndUpdate({OTP:otp},{$set:{
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

const update = async(id,firstname,lastname,email,password,username,phonenumber,dateOfBirth,gender,country,image)=>{
    if (password){
        try {
            let hash = await bcrypt.hash(password,10)
            console.log(`updated`)
            let updateSetter = await SetterRegisterModel.findByIdAndUpdate(id,
                {
                    $set:{
                        firstName:firstname,
                        lastName:lastname,
                        email:email,
                        password:hash,
                        username:username,
                        phonenumber:phonenumber,
                        dateOfBirth:dateOfBirth,
                        gender:gender,
                        country:country,
                        profileImage:image
                    }
                },
                {new:true}
            )
            console.log(updateSetter)
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
                        username:username,
                        phonenumber:phonenumber,
                        dateOfBirth:dateOfBirth,
                        gender:gender,
                        country:country,
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
module.exports = {register,login,update,deleteSetter,forgetPassword,resetPassword}

