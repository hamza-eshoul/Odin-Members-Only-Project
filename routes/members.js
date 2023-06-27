const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

// index route
router.get("/", usersController.users_index);

// login route
router.get("/log-in", usersController.user_log_in_get);

// sign up route
router.get("/sign-up", usersController.user_sign_up_get);

module.exports = router;
