const bcrypt= require("bcryptjs");
const jwt = require("jsonwebtoken");
const { ErrorResponse } = require("../../Error/Utils");
const { AdminRegisterModel } = require("../../Models");

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
        })
    } 

    catch (error) {
        console.log(error)
    }
}

const registerAdmin = async(firstname,lastname,email,password)=>{
    try {
        let findAdmin = await AdminRegisterModel.findOne({email:email})
        if(findAdmin){
            throw new ErrorResponse("Email Already Registered",403)
        }
        else{
            let hashPassword = await bcrypt.hash(password,10)
            let adminInfo = await AdminRegisterModel.create({firstName:firstname,lastName:lastname,email:email,password:hashPassword})
            if  (adminInfo){
                let token = await jwt.sign({adminInfo},process.env.adminKey)
                if(token){
                    return {adminInfo,token}
                }
                else{
                    throw new ErrorResponse ("FAILED TO GENERATE TOKEN",400)
                }
            }
            else{
                throw new ErrorResponse('failed to register admin',400)
            }
        }
    } 
    catch (error) {
        throw new ErrorResponse(error,400)
    }
}


const loginAdmin = async (email,password)=>{
    try {
        let adminInfo  = await AdminRegisterModel.findOne({email:email})
        if( adminInfo){
            let hashPassword = await bcrypt.compare(password, adminInfo.password)
            if (hashPassword){
                let token = await jwt.sign({ adminInfo},process.env.adminKey)
                if(token){
                    return { adminInfo,token}
                }
                else{
                    throw new ErrorResponse ("FAILED TO GENERATE TOKEN",498)
                }
            }
            else{
                throw new ErrorResponse("Invalid Credentials",401)
            }
        }
        else{
            throw new ErrorResponse("Account Not Registered",404)
        }
    } 
    catch (error) {
        throw new ErrorResponse(error,404)
    }
}

//FORGET PASSWORD 
const forgetPassword = async (email)=>{
    try {
        let findUser = await AdminRegisterModel.findOne({email:email})
        if(findUser){
           let randomString= Math.floor(Math.random() * 9000) + 1000;
           let Updated = await AdminRegisterModel.findOneAndUpdate({email:email},{$set:{
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
            let findUser = await AdminRegisterModel.findOne({OTP:otp})
            if (findUser){
                if(findUser.otpValidTill>Date.now()){
                        let updateVerify = await AdminRegisterModel.findOneAndUpdate({OTP:otp},{$set:{
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
                let deleteOtp= await AdminRegisterModel.findOneAndUpdate({OTP:otp},{$set:{
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
        let findUser = await AdminRegisterModel.findOne({email:email})
        if(findUser){
            if(findUser.otpVerified===true){
                let hash =await bcrypt.hash(password,10)
                let updatePassword = await AdminRegisterModel.findOneAndUpdate({email:email},{$set:{
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
            throw new ErrorResponse('invalid Email',404)
        }
    } 
    catch (error) {
        throw new ErrorResponse(error.message,404)
    }
}

const getAdmin = async (id)=>{
    try {
        let admin = await AdminRegisterModel.findById(id)
        if(admin){
            return admin
        }
        else{
            throw new ErrorResponse("No Admin Found",404)
        }
    } 
    catch (error) {
        throw new ErrorResponse(error,404)
    }
}

const updateAdmin = async (id,firstname,lastname,email,password,username,phonenumber,credit,dateOfBirth,gender,country,image)=>{
    if (password){
        try {
            let hash = await bcrypt.hash(password,10)
            let updateAdmin = await AdminRegisterModel.findByIdAndUpdate(id,
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
            if(updateAdmin){
                return updateAdmin
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
            let updateAdmin = await AdminRegisterModel.findByIdAndUpdate(id,
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
            if(updateAdmin){
                return updateAdmin
            }
            else{
                throw new ErrorResponse("failed to update",409)
            }
        } 
        catch (error) {
            throw new ErrorResponse(error,304) 
        }
    }
}

const deleteAdmin = async (id)=>{
    try {
        let deleteAdmin = await AdminRegisterModel.findByIdAndDelete(id)
        if(deleteAdmin){
            return {msg:"ADMIN ACCOUNT DELETED",status:200}
        }
        else{
            throw new ErrorResponse("FAILED TO DELETE NO ACCOUNT FOUND",400)
        }
        
    } catch (error) {
        throw new ErrorResponse(error,500)
    }
}

module.exports = {registerAdmin,loginAdmin,getAdmin,updateAdmin,deleteAdmin,forgetPassword,resetPassword,otpVerification}