const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port =  3000;
const db = require('./config/mongoose.js');
const passport = require('passport');
const passportJwt = require('./config/passport-jwt.js');
const passportGoogle = require('./config/passport-google-oauth2-strategy.js');
const session = require('express-session');
const path = require('path');
require('dotenv').config();
const cors = require('cors');


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Define allowed origins
const allowedOrigins = ["http://localhost:8000", "https://yourcheckmate.netlify.app"];

// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin like mobile apps or curl requests
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions)); // This will handle OPTIONS requests for all routes

//Here we are encrypting the user.id that is stored in session cookie.
app.use(passport.initialize());

//setting up logger it takes two arguments first is the mode or the format (which is a function whoose 
//argument will in the options that we give) and second is the options
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use('/', require('./routes/index.js'));

app.listen(port, function (err) {
    if (err) {
        console.error(err);
        return;
    }
    console.log('Your server is up and running...');
})

