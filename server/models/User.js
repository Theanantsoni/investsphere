const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
  name: String,
  email: {
    type: String,
    unique: true
  },
  phone: String,
  country: String,
  state: String,
  pan: String,
  dob: Date
},
{
  timestamps: true
}
);

const User = mongoose.model("User", userSchema);

module.exports = User;