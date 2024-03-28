const express = require('express');
const fileUpload = require('express-fileupload');
const passport = require('passport');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const { csrfProtection } = require('node-auth-csrf');

/** Environment variables */
require('dotenv').config()
/** Global error handler */
require('express-async-errors');
/** Timezome config */
require('./config/timezone/timezone');

/** Initialize */
const app = express();

/** Dependency injection */
/** Urlencoded parser */
app.use(bodyParser.urlencoded({ extended: false }));

/** Jsonbody parser */
app.use(bodyParser.json());

/** Cookie parser */
app.use(cookieParser());

/** CSRF protection */
app.use(csrfProtection(process.env.CSRF_SECRET));
app.get("/csrf-token", (req, res) => {
    const csrfToken = req.csrfProtection.generateToken();
    res.json({ csrfToken });
});

/** XSS protection */
app.use(helmet());

/** initize passport for authentication (will be used for google, facebook auth) */
app.use(passport.initialize());

/** Corss origin resource sharing */
app.use(cors({ origin: '*' }));

/** File upload */
app.use(fileUpload({
    createParentPath: true,
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

/** Modules */
require('./modules')(app);

// LISTENER
const port = process.env.PORT || 9000;
app.listen(port, () => { console.log("App started at port ", port)});