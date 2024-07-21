const kue = require('kue');
const express = require('express');

const app = express();
// const queue = kue.createQueue();

// Mount kue JSON API
// app.use('/api', kue.app);

// Mount kue UI
app.use('/kue', kue.app);

const port = 3000;  // Change the port number to 3000 or another number

app.listen(port, () => {
    console.log(`Kue dashboard is running on http://localhost:${port}/kue`);
});
