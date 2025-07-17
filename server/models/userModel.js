const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name : {type : String, required : true},
    email : {type : String, required : true, unique : true},
    password : {type : String, required : true},
    role : {type : String , enum : ['user', 'admin','partner'], required : true , default : 'user'},
    otp : {type : String, default : null},
    otpExpiry : {type : Date, default : null},
});

userSchema.pre("save", function (next) {
  console.log("Pre-save Hook", this);
  const now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

// Post-save Hook
userSchema.post("save", function(document, next) {
  console.log(`User ${document} has been saved`)
  next();
});

const userModel = mongoose.model('users', userSchema);
module.exports = userModel;