const mongoose = require("mongoose");

const DepartmemtSchema = mongoose.Schema({
    DeptName:{
        type:String
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
});

module.exports = mongoose.model("Department",DepartmemtSchema);