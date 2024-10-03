const express = require('express');
const registerUser = require('../Controller/registerUser');
const checkEmail = require('../Controller/CheckEmail');
const checkPassword = require("../Controller/CheckPassword");
const userDetails = require('../Controller/userDetails');
const logout = require('../Controller/logout');
const updateUserDetails = require('../Controller/updateUserDetails');
const searchUser = require('../Controller/searchUser');
const forgotgmail = require("../Controller/forgotgmail")
const forgotPassword = require("../Controller/forgotpassword")

const router = express.Router();
// create user API routes

router.post("/register",registerUser)

// login user email API routes
router.post("/email",checkEmail)

// login user password API routes

router.post("/password",checkPassword)

// user Details API routes

router.get("/userdetails",userDetails)

// user logout API routes

router.get("/logout",logout)

// user details update API routes

router.post("/userUpdatedetails",updateUserDetails)

// search user details 

router.post("/searchuser",searchUser)

// forgot gmail API routes

router.post("/forgotgmail",forgotgmail)

// forgot password API routes

router.post("/forgotpassword",forgotPassword)

module.exports = router;