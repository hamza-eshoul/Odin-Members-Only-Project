const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

// index routes
router.get("/", usersController.users_index);

// sign up routes
router.get("/sign-up", usersController.user_sign_up_get);

router.post("/sign-up", usersController.user_sign_up_post);

// login routes
router.get("/log-in", usersController.user_log_in_get);

router.post("/log-in", usersController.user_log_in_post);

// logout routes
router.get("/log-out", usersController.user_log_out_get);

// create message routes
router.get("/create-message", usersController.user_create_message_get);

router.post("/create-message", usersController.user_create_message_post);

// become a member routes
router.get("/become-member", usersController.user_become_member_get);
router.post("/become-member", usersController.user_become_member_post);

// become an admin routes
router.get("/become-admin", usersController.user_become_admin_get);
router.post("/become-admin", usersController.user_become_admin_post);

// delete message route
router.delete("/delete-message/:id", usersController.user_delete_message);

module.exports = router;
