const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
require('./config/view-helper.js')(app);
const port =  3000;
const db = require('./config/mongoose.js');
const passport = require('passport');
const passportLocal = require('./config/passport.js');
const passportJwt = require('./config/passport-jwt.js');
const passportGoogle = require('./config/passport-google-oauth2-strategy.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const path = require('path');
const customMware = require('./config/middleware.js');
const env = require('./config/environment.js');
require('dotenv').config();
const logger = require('morgan');
const cors = require('cors');
const { Server } = require('socket.io');
const {createServer} = require('http');


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//preventing sass middleware to run every time server start when in production mode
if (env.name == 'development') {
    app.use(sassMiddleware({
        src: path.join(__dirname, process.env.ASSET_PATH, 'scss'),
        dest: path.join(__dirname, process.env.ASSET_PATH, 'css'),
        debug: true,
        outputStyle: 'extended',
        prefix: '/css'
    }))
} 

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

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: true,
        credentials: true
    }
});
io.on('connection', (socket) => {
    console.log(`a user connected ${socket.id}`);
})
server.listen(5000);

//Here we are encrypting the user.id that is stored in session cookie.
app.use(session({
    name: 'todo',

    //it is a secret key used to encrypt and decrypt the user.id stored in session
    // TODO change the secret before deployment in production mode
    secret: process.env.SESSION_COOKIE_KEY,

    //True: When saveUninitialized is set to true, the session will be saved to the store even if it is new and has not been modified. This can be useful if you need to track visits to your site for statistics or similar purposes, even if the session data is empty.
    //Example: Consider a web application where users can browse content without logging in or performing any actions that modify the session. With saveUninitialized: true, a session would be created and stored for every visitor, even if they don't do anything that requires session data. This can lead to a large number of unnecessary sessions in your store.
    saveUninitialized: false,

    //True: When resave is set to true, the session will be saved back to the session store, even if the session was never modified during the request.
    resave: false,
    cookie: {
        //setting the expiry time of cookie
        maxAge: (1000 * 60 * 100)
    },
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        autoRemove: 'disabled',
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

//code for setting up flash messages
app.use(flash());
app.use(customMware.setFlash);

//setting up logger it takes two arguments first is the mode or the format (which is a function whoose 
//argument will in the options that we give) and second is the options
app.use(logger(env.morgan.mode, env.morgan.options));

app.use(cookieParser());
app.use(express.static('./' + process.env.ASSET_PATH));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

//making uploads folder static(i.e. making it available for finding static files)
app.use("/uploads", express.static(__dirname + "/uploads"));

app.use('/', require('./routes/index.js'));

app.listen(port, function (err) {
    if (err) {
        console.error(err);
        return;
    }
    console.log('Your server is up and running...');
})

