const express = require("express");
const mongoose = require("mongoose");
const BookingModel = require("./models/BookingModel");
const Department = require("./models/DepartmentModel");
const Hall = require("./models/HallModel");
const BookingRouter = require("./routers/BookingRouter")
const cors = require("cors");
const { LoginRouter } = require("./routers/LoginRouter");
const app = express();

app.use(express.json());
app.use(cors({
    origin:"http://localhost:3000",
    methods:["POST","GET","PUT","PATCH","DELETE"],
    credentials:true
}));

mongoose.connect("mongodb://localhost:27017/hall_booking");



app.use("/",BookingRouter);
app.use("/",LoginRouter);

app.listen(3900,console.log("Server Started at 3900"));











