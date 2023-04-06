const { setterProfileModel } = require("../../Models");
const { ErrorResponse } = require("../../Error/Utils");

const postProfile = async (accountId,name,email,phone,dateOfBirth,gender,country,image)=>{
    try {
        const postProfile = await setterProfileModel.create({
            accountId:accountId,
            username:name,
            useremail:email,
            phonenumber:phone,
            credit:500,
            dateOfBirth:dateOfBirth,
            gender:gender,
            country:country,
            profileImage:image,
        })
        if(postProfile){
            return postProfile
        }
        else{
            throw new ErrorResponse("failed to post",409)
        }
    } catch (error) {
        console.log(error)
        throw new ErrorResponse(error.message,409)
    }
}

const getProfile = async (accountId)=>{
    try {
        let find = await setterProfileModel.findOne({accountId:accountId})
        if (find){
            return {find}
        }
        else{
            throw new ErrorResponse('invalid or wrong id no data found',404)   
        }
    } 
    catch (error) {
        throw new ErrorResponse(error.message,404)
    }
}

const updateProfile = async (id,name,email,phone,dateOfBirth,gender,country,image,credit) =>{
    try {
        let update = await setterProfileModel.findByIdAndUpdate(id,{
            username:name,
            useremail:email,
            phonenumber:phone,
            dateOfBirth:dateOfBirth,
            gender:gender,
            country:country,
            profileImage:image,
            credit:credit
        },{new:true})
        if(update){
            return update
        }
        else{
            throw new ErrorResponse('invalid or wrong id failed to update',404)   
        }
    } 
    catch (error) {
        throw new ErrorResponse(error.message,404)
    }
}
module.exports = {postProfile,getProfile,updateProfile}