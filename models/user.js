const mongoose = require("mongoose");

//  Define a schema
const Schema = mongoose.Schema;

// Instatiate a user Schema
const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  membershipStatus: {
    type: String,
    enum: ["member", "newMember"],
    required: true,
  },
  userImg: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: false,
  },
});

module.exports = mongoose.model("User", userSchema);
