const express = require("express");
const router = express.Router();
const task_controller = require('../controllers/task_controller.js');


router.post('/create', task_controller.create);
router.get('/delete/:id', task_controller.delete);
router.post('/update', task_controller.update);

module.exports = router;