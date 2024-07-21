const express = require("express");
const router = express.Router();
const home_controller = require('../controllers/home_controller.js');

router.use('/user', require('./user'));
router.use('/task', require('./task'));
router.use("/api", require("./api"));
router.get('/',  home_controller.unknown);
router.get('/home',  home_controller.home);

module.exports = router;