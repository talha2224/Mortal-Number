const bcrypt= require("bcryptjs");
const jwt = require("jsonwebtoken");
const { ErrorResponse } = require("../../Error/Utils");
const { AdminRegisterModel } = require("../../Models");

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

module.exports = {registerAdmin,loginAdmin,getAdmin,updateAdmin,deleteAdmin}