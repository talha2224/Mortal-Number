const {ErrorResponse} = require("../../Error/Utils");
const { SetterRegisterModel, GameModel } = require("../../Models");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");


// NODE MAILER CONFIGURATION
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
                    let {OTP,otpValidTill,otpVerified,password,createdAt,updatedAt,__v,...setterInfo} = setter._doc
                    return {setterInfo,token}
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
            if(SetterDetails.accountBlocked===false){
                let comparePassword = await bcrypt.compare(password,SetterDetails.password)
                if(comparePassword){
                     let token = jwt.sign({SetterDetails},process.env.secretKey)
                     if(token){
                         let {OTP,otpValidTill,otpVerified,password,createdAt,updatedAt,__v,...setterInfo} = SetterDetails._doc
                         return {setterInfo,token}
                     }
                     else{
                     throw new ErrorResponse('failed to generate token',500)
                     }
                } 
                 else{
                     throw new ErrorResponse ("invalid credentials",401)
                }
            }
            else if (SetterDetails.accountBlocked===true){
                throw new ErrorResponse('your account has been blocked',403)
            }
        }

        catch (error) {
            throw new ErrorResponse(error,403)
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
           let Updated = await SetterRegisterModel.findOneAndUpdate({email:email},{$set:{
            OTP:randomString,
            otpValidTill: new Date( new Date().setMinutes(new Date().getMinutes()+5))
           }})
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

// OTP VERIFCATION
const otpVerification = async (otp)=>{
    try {
        let findUser = await SetterRegisterModel.findOne({OTP:otp})
        if (findUser){
            if(findUser.otpValidTill>Date.now()){
                let updateVerify = await SetterRegisterModel.findOneAndUpdate({OTP:otp},{$set:{
                    otpVerified:true
                }})
                if (updateVerify){
                    return {msg:"OTP VERIFIED",sucess:true}
                }
                else{
                    return {msg:"OTP NOT VERIFIED",sucess:false,status:500}
                }
            }
            else{
                let deleteOtp= await SetterRegisterModel.findOneAndUpdate({OTP:otp},{$set:{
                    OTP:null,
                    otpValidTill:null
                }})
                throw new ErrorResponse('otp timeout please again call forget password api',408)
            }
        }
        else{
            throw new ErrorResponse('wrong otp given',404)
        }
    } 
    catch (error) {
        throw new ErrorResponse(error.message,404)
    }
}

//RESET PASSWORD
const resetPassword = async (email,password)=>{
    try {
        let findUser = await SetterRegisterModel.findOne({email:email})
        if(findUser){
            if(findUser.otpVerified===true){
                let hash =await bcrypt.hash(password,10)
                let updatePassword = await SetterRegisterModel.findOneAndUpdate({email:email},{$set:{
                    password:hash,
                    OTP:null,
                    otpValidTill:null,
                    otpVerified:false
                }})
                if(updatePassword){
                    return {msg:"password updated sucesfully sucesfully"}
                }
            }
            else{
                throw new ErrorResponse("OTP NOT VERIFIED PLEASE VERIFY FIRST",500)
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

const update = async(id,firstname,lastname,email,password,username,phonenumber,dateOfBirth,gender,country,image,accountBlocked)=>{
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
                        profileImage:image,
                        accountBlocked:accountBlocked
                    }
                },
                {new:true}
            )
            if(updateSetter){
                let {OTP,otpValidTill,otpVerified,password,createdAt,updatedAt,__v,...updatedInfo} = updateSetter._doc
                if (accountBlocked===true){
                    let updateGame = await GameModel.findOneAndUpdate({setterId:id},{
                        $set:{
                            active:false
                        }
                    })
                }
                return updatedInfo
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
                        profileImage:image,
                        accountBlocked:accountBlocked
                    }
                },
                {new:true}
            )
            if(updateSetter){
                let {OTP,otpValidTill,otpVerified,password,createdAt,updatedAt,__v,...updatedInfo} = updateSetter._doc
                if (accountBlocked){
                    let updateGame = await GameModel.findOneAndUpdate({setterId:id},{$set:{active:false}})
                }
                return updatedInfo
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

const getSingleSetter = async(id)=>{
    try {
        let singleSetter = await SetterRegisterModel.findById({_id:id})
        if(singleSetter){
            let {OTP,otpValidTill,otpVerified,password,createdAt,updatedAt,__v,...setterInfo} = singleSetter._doc
            return setterInfo
        }
    } 
    catch (error) {
        
    }
}

//CHANGE PASSWORD
const changePassword = async (id,oldpassword,newpassword)=>{
    try {
        let find = await SetterRegisterModel.findById(id)
        if (find){
            let comparePassword = await bcrypt.compare(oldpassword,find.password)
            if (comparePassword){
                let hash = await bcrypt.hash(newpassword,10)
                let update = await SetterRegisterModel.findByIdAndUpdate(id,{$set:{
                    password:hash
                }},{new:true})
                if(update){
                    return {msg:'password updated sucesfully'}
                }
            }
            else{
                throw new ErrorResponse('wrong password',401)
            }
        }
        else{
            throw new ErrorResponse('wrong user id passed no reacord found',404)
        }
    } 
    catch (error) {
        throw new ErrorResponse(error.message,404)
    }
}

// TOP 5 SETTER
const topRated = async()=>{
    try {
        let top = await SetterRegisterModel.find({accountBlocked:false}).sort({credit:-1}).limit(5)
        if (top.length>0){
            return top
        }
        else{
            throw new ErrorResponse('no data found addsome',404)
        }
        
    } 
    catch (error) {
        throw new ErrorResponse(error.message,404)
    }
}

module.exports = {register,login,update,deleteSetter,forgetPassword,resetPassword,otpVerification,getSingleSetter,changePassword,topRated}

