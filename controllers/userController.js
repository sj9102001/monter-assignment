const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require("../models/User");

const SALT_ROUNDS = 10;
const SECRET_KEY = process.env.SECRET_KEY;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

function sendOTP(email, otp) {
    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: 'OTP Verification',
        text: `Your OTP for email verification is: ${otp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(process.env.EMAIL_USERNAME);
            console.log(email);
            console.log('Error occurred:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

exports.signup = async (req, res) => {
    try {
        const { email, password } = req.body;

        //checking if user already exists
        const user = await User.findOne({ email });
        if (user) {
            //check if user is verified
            if (user.isVerified === true) {
                return res.status(400).json({ message: "User already exist" });
            }
        }

        //hashing the password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        //generating OTP
        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        if (user) {
            //replace the old data
            await User.findOneAndUpdate(
                { email: email },
                { $set: { password: hashedPassword, otp: generatedOtp } },
                { new: true }
            );
        } else {
            //create new
            const newUser = new User({ email, password: hashedPassword, otp: generatedOtp, isVerified: false });
            await newUser.save();
        }
        //Send the otp via email to the user
        sendOTP(email, generatedOtp);
        res.status(201).json({ message: "Email sent succesfully, Please verify the user." });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Internal Server Error" });
    }
};

exports.login = async (req, res) => {

};

exports.logout = async (req, res) => {

};

exports.verify = async (req, res) => {
    try {
        const { email, otp: enteredOtp } = req.body;
        const userInformation = await User.findOne({ email });
        if (userInformation.isVerified === true) {
            //user already verified
            res.status(201).json({ message: "User already verified, please log in!" });
        } else {
            //verify the user
            console.log(userInformation)
            if (enteredOtp === userInformation.otp) {
                //otp is correct
                userInformation.otp = "";
                userInformation.isVerified = true;
                await userInformation.save();
                res.status(200).json({ message: "OTP Verified, please log in!" });
            } else {
                res.status(401).json({ message: "Incorrect OTP, Please try again" });
            }
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}