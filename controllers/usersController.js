const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const passport = require("passport");

// index
exports.users_index = async (req, res, next) => {
  res.render("index", { user: req.user });
};

// sign-up
exports.user_sign_up_get = async (req, res, next) => {
  res.render("sign-up", {
    errors: "",
    user: req.user,
  });
};

exports.user_sign_up_post = [
  // Validate and sanitize the form fields
  body("username", "Username must contain at least 3 characters ")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("password", "Password must at least contain 6 characters")
    .trim()
    .isLength({ min: 6 })
    .escape(),
  body(
    "confirmPassword",
    "The confirmation password does not match the inserted password"
  ).custom((value, { req }) => {
    return value === req.body.password;
  }),

  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from the reequest
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with error messages
      res.render("sign-up", {
        errors: errors.array(),
      });
      return;
    } else {
      // Data form is valid

      // Hash password using bcrypt
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      // Add the new user to the DB
      const newUser = new User({
        userName: req.body.username,
        password: hashedPassword,
        membershipStatus: "newMember",
      });

      await newUser.save();
      // New user saved. Redirect to the homepage
      res.redirect("/members");
    }
  }),
];

// log in
exports.user_log_in_get = async (req, res, next) => {
  res.render("log_in", {
    user: req.user,
  });
};

exports.user_log_in_post = passport.authenticate("local", {
  successRedirect: "/members",
  failureRedirect: "/members/log-in",
});

// log out
exports.user_log_out_get = async (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/members");
  });
};

// create message
exports.user_create_message_get = async (req, res, next) => {
  res.render("create_message", {
    user: req.user,
  });
};
