const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    Department:{
        type:String
    },
    hall:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"HallModel"
    },
    MeetingDescription:{
        type:String,
    },
    bookingDate:{
        type:Date
    },
    startTime:{
        type:String
    },
    endTime:{
        type:String
    },
    status:{
        type:String,
        enum:["pending","approved","rejected","cancelled","completed"],
        default:"pending"
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }

})
 

module.exports = mongoose.model("Booking",BookingSchema)