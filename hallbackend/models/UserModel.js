const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String,
    },
    password:{
        type:String,
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})
module.exports = mongoose.model("User",UserSchema)