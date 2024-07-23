const express = require("express");
const router = express.Router();
const passport = require("passport");

let tasks_controller = require("../../../controllers/api/v1/tasks.js");
// router.delete('/:id', passport.authenticate('jwt', { session: false }) ,tasks_controller.delete);
router.delete('/delete/:id',passport.authenticate('jwt', { session: false }), tasks_controller.delete);
router.get('/list', passport.authenticate('jwt', { session: false }), tasks_controller.list);
router.post('/create', passport.authenticate('jwt', { session: false }), tasks_controller.create);
router.post('/update/:id', tasks_controller.update);
router.get('/mark_complete/:id', passport.authenticate('jwt', { session: false }), tasks_controller.mark_complete);
router.get('/mark_imp/:id', tasks_controller.mark_imp);

module.exports = router;