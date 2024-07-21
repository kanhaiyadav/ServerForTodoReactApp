const Task = require('../model/task_model.js');
const User = require('../model/users_model.js');
// const taskMailer = require("../mailers/tasks-mailer.js");
const queue = require('../config/kue');
const taskEmailWorker = require('../workers/task_email_worker.js');


module.exports.create = async (req, res) => {
    try {
        let user = await User.findById(req.user._id);
        let task = await Task.create({
            description: req.body.description,
            category: req.body.category,
            date: req.body.date,
            user: req.user._id
        });
        await task.populate('user');
        await user.tasks.push(task);
        await user.save();
        // taskMailer.newTask(task);
        let job = queue.create('emails', task).save(function (err) {
            if (err) {
                // console.log("error in sending to the queue", err);
                return;
            }
            // console.log("job enqueued", job.id);
        })
        if (req.xhr) {
            return res.status(200).json({
                data: {
                    task: task
                },
                message: "Task created successfully"
            });
        }
        return res.redirect('/home');
    } catch (err) {
        console.error(err);
        if (req.xhr) {
            return res.status(500).json({
                message: "Error in deletig the task!"
            });
        }
        return res.redirect('/home');
    }
}


module.exports.update = async (req, res) => {
    try {
        // let task = await Task.findById(req.body.id);
        await Task.findByIdAndUpdate(req.body.id, req.body.form_data);
        // await task.save();
        res.status(200).json({
            message: "updated successfully",
            data: {
                task_id: req.body.id,
                task: await Task.findById(req.body.id)
            }
        })

    } catch (err) {
        // console.log(err);
        res.status(500).json({
            message: "Some error has occurred!!"
        })
    }
}

module.exports.delete = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.user._id, { $pull: { tasks: req.params.id } });
        await user.save();
        await Task.findByIdAndDelete(req.params.id);
        if (req.xhr) {
            return res.status(200).json({
                data: {
                    task_id: req.params.id,
                    task_count: user.tasks.length-1,
                },
                message: "Task deleted successfully"
            });
        }
        return res.redirect('/home');
    } catch (err) {
        // console.log(err);
        if (req.xhr) {
            return res.status(500).json({
                message: "Failed to delte the task!!"
            });
        }
        return res.redirect('/home');
    }

}