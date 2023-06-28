const mongoose = require("mongoose");

//  Define a schema
const Schema = mongoose.Schema;

// Instatiate a user Schema
const userSchema = new Schema({
  userName: {
    type: "String",
    require: true,
  },
  password: {
    type: "String",
    required: true,
  },
  membershipStatus: {
    type: "String",
    enum: ["member", "newMember"],
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
