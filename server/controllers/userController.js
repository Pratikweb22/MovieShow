const { response,request } = require("express");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const EmailHelper = require("../util/emailHelper");

function otpGenerator() {
  return Math.floor(Math.random() * 10000 + 90000);
}


const registerUser = async (req, res) => {
    try {
        const userExists = await userModel.findOne({ email: req.body.email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const newUser = new userModel(req.body);
        await newUser.save();

        res.json({
            success: true,
            message: "Registration successful",
        });
    } catch (error) {
        console.error("Error in registerUser:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email : req.body.email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }

        if (user.password !== password) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }
        // Here you would typically generate a JWT token and send it back to the client
        
        const token = jwt.sign({ userId: user._id }, process.env.jwt_secret, {
            expiresIn: '1d'
        });

        return res.json({
            success: true,
            message: "Login successful",
            data: token
        });

    } catch (error) {
        console.error("Error in loginUser:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.userId).select("-password");

    res.send({
      success: true,
      message: "User details fetched successfully",
      data: user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please enter an email address.",
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No user found with email: ${email}`,
      });
    }

    const otp = otpGenerator();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    await EmailHelper("otp.html", user.email, {
      name: user.name,
      otp: otp,
    });

    return res.status(200).json({
      success: true,
      message: `OTP sent to ${user.email}`,
    });
  } catch (err) {
    console.error("Forget Password Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ✅ Reset Password
const resetPassword = async (req, res) => {
  try {
    const { otp, password } = req.body;

    if (!otp || !password) {
      return res.status(400).json({
        success: false,
        message: "OTP and password are required.",
      });
    }

    const user = await userModel.findOne({ otp });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    if (Date.now() > user.otpExpiry) {
      return res.status(401).json({
        success: false,
        message: "OTP has expired.",
      });
    }

    
    user.password = password;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful.",
    });
  } catch (err) {
    console.error("Reset Password Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


module.exports = { registerUser, loginUser,getCurrentUser, forgetPassword, resetPassword };
