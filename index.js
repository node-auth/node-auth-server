const express = require('express');

/** Environment variables */
require('dotenv').config()
/** Global error handler */
require('express-async-errors');
/** Timezome config */
require('./config/timezone/timezone');

/** Initialize */
const app = express();

/** Dependency injection */
require('./startup/dependencies')(app);

/** Routes */
require('./startup/routes')(app);

// LISTENER
const port = process.env.PORT || 9000;
app.listen(port, () => { console.log("App started at port ", port)});