const mongoose = require("mongoose");

const HallSchema = new mongoose.Schema({
    hallName:{
        type:String
    },
    department:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Department",
    },
    capacity:{
        type:Number
    },
    isActive:{
        type:Boolean,
        default:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }

});

module.exports = mongoose.model("HallModel",HallSchema);