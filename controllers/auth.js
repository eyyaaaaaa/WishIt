const { findOne } = require('../models/User');
const User = require('../models/User');
const ErrorResponse = require("../utils/errorResponse");

exports.signup = async (req, res , next) => {
    const { username, email, password, phone, dateOfBirth, gender } = req.body;

    try{
        const user = await User.create({
             username, email, password, phone, dateOfBirth, gender
        });
       sendToken(user,201, res);
    } catch(error){
       next(error);

    }
};

exports.signin = async (req, res , next) => {
    const { email, password } = req.body;
    if( !email || !password){
       return  next(new ErrorResponse("provide an email and password", 400))
    }
    try{
        const user=findOne({email }).select("+password");
        if(!user){
            return  next(new ErrorResponse("invalid credentials", 401))

        }

        const isMatched = await user.matchPasswords(password);

        if(! isMatched){
            return  next(new ErrorResponse("invalid credentials", 401))
        }

        sendToken(user,200, res);

    }catch(error){
        res.status(500).json({success:false,error: error.message});

    }

};

exports.forgotPassword = async (req, res , next) => {
   const {email} =req.body;
   try {
    const user = await User.findOne({email});
    if(!user){
        return  next(new ErrorResponse("Email could not be sent", 404))
    }

    const resetToken = user.getResetPasswordToken();
    await user.save();
    const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`;
    const message = `
        <h1>You have requested a new password reset</h1>
        <p>Please go to this link to reset your password</p>
        <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `;
    // we are going to send an email here
    try {
        
    } catch (error) {
        
    }

   } catch (error) {
    
   }
};

exports.resetPassword = (req, res , next) => {
    res.send("reset password route");
};


const sendToken =(user, statusCode, res) =>
{
    const token = user.getSignedToken();
    res.status(statusCode).json({success:true, token})
};