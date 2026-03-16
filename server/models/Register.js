const mongoose = require("mongoose");

const registerSchema = new mongoose.Schema({

name:{
type:String,
trim:true
},

email:{
type:String,
required:true,
unique:true,
lowercase:true,
trim:true,
index:true
},

phone:{
type:String,
match:/^[0-9]{10}$/,
index:true
},

country:{
type:String,
default:"India"
},

state:{
type:String
},

pan:{
type:String,
uppercase:true,
match:/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
},

dob:{
type:Date
},

password:{
type:String,
minlength:6
},

otp:{
type:String
},

otpExpire:{
type:Date
},

verified:{
type:Boolean,
default:false,
index:true
}

},{
collection:"register",
timestamps:true
});

module.exports=mongoose.model("Register",registerSchema);