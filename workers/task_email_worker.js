const queue = require('../config/kue');

const taskMailer = require('../mailers/tasks-mailer');

queue.process('emails', function (job, done) {
    console.log('task email worker is processing a job', job.data);
    taskMailer.newTask(job.data);
    done();
})