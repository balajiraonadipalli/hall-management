const UserModel = require("../models/UserModel");
const express = require("express");
const LoginRouter = express.Router();
const jstoken = require("jsonwebtoken")

LoginRouter.post("/Login", async (req, res) => {
    console.log(req.body);
    const { email, password, admin } = req.body;
    try {
        const existUser = await UserModel.findOne({ email });
        if (existUser.matchpassword(password) && existUser.role == admin) {
            return res.status(201).json({
                existUser,
                token: generateToken(existUser._id)
            })
        }
        res.status(400).json({ message: "Incorrect password" })
    } catch (error) {
        res.status(500).json({ message: error })
    }
})

LoginRouter.post("/register", async (req, res) => {
    console.log(req.body);
    try {
        const { email, password, username, admin } = req.body;
        console.log(email + password + username + admin)
        const existUser = await UserModel.findOne({ email });
        console.log(existUser)
        if (existUser != null) {
            return res.status(400).json({ message: "email already exist" });

        }
        const newUser = await UserModel.create({
            email,
            password,
            name: username,
            role: admin
        })
        res.status(201).json({ message: "Login successful", newUser,token:generateToken(newUser._id) })
    } catch (error) {
        res.status(500).json({ message: error })
    }
})

const generateToken = (id) => {
    return jstoken.sign({ id }, "Balaji", {
        expiresIn: "10d"
    })
}

module.exports = { LoginRouter }