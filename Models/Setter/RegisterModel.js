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


    username:{
        type:String,
        default:null
    },

    phonenumber:{
        type:String,
        default:null,
    },

    credit:{
        type:Number
    },
    
    dateOfBirth:{
        type:String,
        default:null
    },

    gender:{
        type:String,
        default:null
    },

    country:{
        type:String,
        default:null
    },

    profileImage:{
        type:String,
        default:null
    }
},{
    toJSON:{
        transform(doct, ret) {
            delete ret.password;
            delete ret.createdAt;
            delete ret.updatedAt;
        }
    },timestamps: true,
}
)
const SetterInfo = mongoose.model('SetterInfo',RegisterModel,'SetterInfo')

module.exports = SetterInfo