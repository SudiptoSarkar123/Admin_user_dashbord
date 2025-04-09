const mongoose = require('mongoose')


const UserSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    is_verified:{type:Boolean,default:true},
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['candidate','admin'],
        default:'candidate'
    }


},{timestamps:true})


const Usermodel = mongoose.model('Admin',UserSchema)
module.exports = Usermodel;