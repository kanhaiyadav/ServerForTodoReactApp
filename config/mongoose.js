const mongoose = require('mongoose');
const env = require('./environment.js');
require('dotenv').config();

main().catch(err => console.log(err));

async function main() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Database connection successful...");  // Connection success message
    } catch (err) {
        console.error('Problem connecting to the database', err);  // Connection error handling
    }

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}


// let mongoose = require("mongoose");

// mongoose.connect("mongodb://localhost/tasks_db");

// let db = mongoose.connection;

// db.on('error', console.error.bind(console, 'Problem connecting to the database'));

// db.once('open', ()=>{
//     console.log("Databse connection successful...");
// })

// module.exports = db;