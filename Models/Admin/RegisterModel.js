const mongoose = require ('mongoose')

const RegisterModel = mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    profileImage:{
        type:String,
        required:true
    }
},
{
    toJSON:{
        transform(doct, ret) {
            delete ret.password;
            delete ret.createdAt;
            delete ret.updatedAt;
        }
    },timestamps: true,
}
)

const AdminInfo = mongoose.model('AdminInfo',RegisterModel,'AdminInfo')

module.exports = AdminInfo