require('dotenv').config();

// const redisConfig = {
//     redis: {
//         host: process.env.REDIS_HOST || '172.31.46.223',  // Default to localhost
//         port: process.env.REDIS_PORT || 6379,        // Default Redis port
//     }
// };
const kue = require('kue');

// const queue = kue.createQueue(redisConfig);
const queue = kue.createQueue();

module.exports = queue;