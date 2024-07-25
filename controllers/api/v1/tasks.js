let Task = require("../../../model/task_model.js");

module.exports.list = async (req, res) => {
    let tasks = await Task.find({user: req.user._id});
    return res.status(200).json({
        data: {
            tasks: tasks
        },
        message: "Tasks fetched successfully",
    });
}
module.exports.delete = async (req, res) => {
    try {
        console.log(req.params.id);
        await Task.findByIdAndDelete(req.params.id);
        await req.user.tasks.pull(req.params.id);
        req.user.taskDeleted += 1;
        await req.user.save();
        return res.status(200).json({
            message: "Task deleted successfully",
            data: {
                _id: req.params.id
            }
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to delete the task"
        });
    }
}

module.exports.create = async (req, res) => {
    try {
        let task = await Task.create({
            type: req.body.type || "due",
            description: req.body.description,
            category: req.body.category,
            date: req.body.date,
            user: req.user._id
        });
        await req.user.tasks.push(task._id);
        req.user.taskCreated += 1;
        await req.user.save();
        return res.status(200).json({
            data: {
                task: task,
            },
            message: "Task created successfully"
        })
        // taskMailer.newTask(task);
        // let job = queue.create('emails', task).save(function (err) {
        // if (err) {
        // console.log("error in sending to the queue", err);
        // return;
        // }
        // console.log("job enqueued", job.id);
        // });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: err
        });
    }
}


module.exports.update = async (req, res) => {
    try {
        let task = await Task.findByIdAndUpdate(req.params.id, req.body);
        await task.save();
        task = await Task.findById(req.params.id);
        return res.status(200).json({
            data: {
                task: task
            },
            message: "Task updated successfully"
        })
    } catch (err) {
        console.error(err);
    }
}

module.exports.mark_complete = async (req, res) => {
    try {

        let task = await Task.findById(req.params.id);
        task.due = false;
        await task.save();
        req.user.taskCompleted += 1;
        await req.user.save(); 
        return res.status(200).json({
            data: {
                id: req.params.id,
            },
            message: "Task marked as completed successfully"
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: err
        })
    }
}

module.exports.mark_imp = async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);
        task.important = !task.important;
        await task.save();
        return res.status(200).json({
            data: {
                id: req.params.id,
            },
            message: "Marked important successfully"
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: err
        })
    }
}