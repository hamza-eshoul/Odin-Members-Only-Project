const User = require("../models/user");

// index
exports.users_index = async (req, res, next) => {
  res.render("index");
};

// sign-up
exports.user_sign_up_get = async (req, res, next) => {
  res.render("sign-up");
};

// login
exports.user_log_in_get = async (req, res, next) => {
  res.render("log_in");
};
