const { Timestamp } = require('bson')
const mongoose = require('mongoose')
const { type } = require('os')

const UserSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        // unique:true
    },
    is_verified:{type:Boolean,default:false},
    password1:{
        type:String,
        required:true
    },
    password2:{
        type:String,
        required:true
    }

},{timestamps:true})


const userModel = mongoose.model('user',UserSchema)
module.exports = userModel ;