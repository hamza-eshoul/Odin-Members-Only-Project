const User = require("../models/user");
const Message = require("../models/messages");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const passport = require("passport");

// index
exports.users_index = async (req, res, next) => {
  // get all messages from the database
  const messages = await Message.find({}).sort({ createdAt: -1 });

  res.render("index", { user: req.user, messages: messages });
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
  body("username", "Username already in use").custom(async (value) => {
    const user = await User.findOne({ userName: value });
    if (user) {
      throw new Error("Username already in use");
    }
  }),
  body("password", "Password must at least contain 6 characters")
    .trim()
    .isLength({ min: 6 })
    .escape(),
  body("image_location", "One car image must at least be selected").isLength({
    min: 1,
  }),
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
        user: req.user,
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
        userImg: req.body.image_location,
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
    errors: "",
  });
};

exports.user_create_message_post = [
  // Validate and sanitize data
  body("messageTitle", "Message title should not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("messageContent", "Message content must at least contain 6 characters")
    .trim()
    .isLength({ min: 6 })
    .escape(),

  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from the request
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with error messages
      res.render("create_message", {
        user: req.user,
        errors: errors.array(),
      });
      return;
    } else {
      // Data form is valid

      // create a new message document
      const newMessage = await new Message({
        messageTitle: req.body.messageTitle,
        messageContent: req.body.messageContent,
        messageAuthor: req.user.userName,
        messageImg: req.user.userImg,
      });

      // save the new message to the database
      newMessage.save();

      // redirect to the homepage
      res.redirect("/members");
    }
  }),
];

// become a member
exports.user_become_member_get = async (req, res, next) => {
  res.render("become_member", {
    user: req.user,
    errors: "",
  });
};

exports.user_become_member_post = [
  // Check whether the passcode is correct
  body("memberPasscode", "The member passcode is incorrect")
    .trim()
    .equals(process.env.MEMBERS_PASS_CODE)
    .escape(),

  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from the request
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with error messages
      res.render("become_member", {
        user: req.user,
        errors: errors.array(),
      });
      return;
    } else {
      // Data form is valid

      // Update the membership status of the user
      const updateMemberStatus = await User.findByIdAndUpdate(req.user.id, {
        $set: { membershipStatus: "member" },
      });

      updateMemberStatus.save();

      res.redirect("/members/become-member");
    }
  }),
];

// become an admin
exports.user_become_admin_get = async (req, res, next) => {
  res.render("become_admin", {
    user: req.user,
    errors: "",
  });
};

exports.user_become_admin_post = [
  // Check whether the passcode is correct
  body("adminPasscode", "The admin passcode is incorrect")
    .trim()
    .equals(process.env.ADMIN_PASS_CODE)
    .escape(),

  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from the request
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with error messages
      res.render("become_admin", {
        user: req.user,
        errors: errors.array(),
      });
      return;
    } else {
      // Data form is valid

      // Update the membership status of the user
      const updateMemberRights = await User.findByIdAndUpdate(req.user.id, {
        $set: { isAdmin: true },
      });

      updateMemberRights.save();

      res.redirect("/members/become-admin");
    }
  }),
];

// delete message
exports.user_delete_message = async (req, res, next) => {
  // Delete the message from the database
  const deleteMsgDb = await Message.findByIdAndDelete(req.params.id);

  res.json({
    resMSg: "the message has been succesfully deleted, refresh the page",
  });
};
