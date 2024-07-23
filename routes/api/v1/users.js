const express = require("express");
const router = express.Router();
const userController = require("../../../controllers/api/v1/users.js");
const passport = require("passport");


router.post("/create-session", userController.createSession);
router.post("/register", userController.register);
router.post("/login", userController.createSession);
router.get("/verify", passport.authenticate('jwt', { session: false }), userController.verify);
router.post("/change_username", passport.authenticate('jwt', { session: false }), userController.change_username);
router.delete("/delete", passport.authenticate('jwt', { session: false }), userController.delete);

module.exports = router;