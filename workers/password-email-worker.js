const queue = require('../config/kue');

const passwordMailer = require('../mailers/password-mailer.js');

queue.process('emails', function (job, done) {
    console.log('password email worker is processing a job', job.data);
    passwordMailer.resetPassword(job.data);
    done();
})