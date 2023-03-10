const crypt = require('crypto');
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    
      username: {
        type: String,
        unique: true,
        required: [true,"Please provide a username"]
      },
      email: {
        type: String,
        unique: true,
        required: [true,"Please provide an email"]
      },
      password: {
        type: String,
        required: [true,"Please provide a password"],
        minlength: 6,
        select: false,
        resetPasswordToken: String,
        resetPasswordExpire :Date
      },
      
      profilePicture: {
        type: String,
        default: 'default-profile-picture.jpg',
      },
      coverPhoto: {
        type: String,
        default: 'default-cover-photo.jpg',
      },
      about: {
        type: String,
      },
      contactInfo: {
        phone: {
          type: String,
        },
        address: {
          type: String,
        },
        website: {
          type: String,
        },
      },
      dateOfBirth: {
        type: Date,
      },
      gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required:[true,"Please choose your gender"]
      },
      education: {
        type: String,
      },
      work: {
        type: String,
      },
      friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }],
      posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
      }],
      privacySettings: {
        type: Object,
        default: {
          profileVisibility: 'public',
          postVisibility: 'public',
        },
      },
    
});

UserSchema.pre("save",async function(){
  if(!this.isModified("password")){
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
})

UserSchema.methods.matchPasswords = async function(password){
  return await bcrypt.compare(password, this.password);
}

UserSchema.methods.getSignedToken = function (){
  return jwt.sign({id: this._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE})
}
UserSchema.methods.getResetPassword= function(){
  const resetToken= crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  this.resetPasswordExpire = Date.now()+10* (60*1000);

  return resetToken;
}

const User= mongoose.model("User", UserSchema);
module.exports = User;