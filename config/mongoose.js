const mongoose = require('mongoose');
require('dotenv').config();

main().catch(err => console.log(err));

async function main() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Database connection successful...");  // Connection success message
    } catch (err) {
        console.error('Problem connecting to the database', err);  // Connection error handling
    }
}