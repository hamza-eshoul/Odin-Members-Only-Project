const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

// index route
router.get("/", usersController.users_index);

// sign up route
router.get("/sign-up", usersController.user_sign_up_get);

router.post("/sign-up", usersController.user_sign_up_post);

// login route
router.get("/log-in", usersController.user_log_in_get);

router.post("/log-in", usersController.user_log_in_post);

// logout route
router.get("/log-out", usersController.user_log_out_get);

// create message route
router.get("/create-message", usersController.user_create_message_get);

module.exports = router;
