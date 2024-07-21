const User = require('../model/users_model.js');

const express = require('express');
const router = express.Router()
const user_controller = require("../controllers/user_controller.js");
const passport = require('passport');

router.get('/signin', user_controller.signin);
router.get('/signup', user_controller.signup);
router.get('/logout', user_controller.logout);
router.get('/settings', user_controller.settings);
router.get('/profile',passport.checkAuthenticated, user_controller.profile);
router.post('/create_user', user_controller.create);
router.post('/update', User.uploadedAvatar, user_controller.update);
router.post('/authorize',passport.authenticate('local',{
    failureRedirect: '/user/signin',
    failureFlash: "Invalid username or password",
}), user_controller.authorize);
router.get('/forgot-password', user_controller.forgotPassword);
router.post('/identify', user_controller.indentify);
router.get('/varified/:id', user_controller.varified);
router.get('/reset-password/:token', user_controller.resetPassword);
router.post('/update-password', user_controller.updatePassword);

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/user/signin' }), user_controller.authorize); 

module.exports = router;