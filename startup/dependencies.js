const fileUpload = require('express-fileupload');
const passport = require('passport');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const helmet = require('helmet');
const cors = require('cors');

module.exports = (app) => {
    /** Urlencoded parser */
    app.use(bodyParser.urlencoded({ extended: false }));

    /** Jsonbody parser */
    app.use(bodyParser.json());

    /** Cookie parser */
    app.use(cookieParser());

    /** CSRF protection */
    app.use(csrf({ cookie: true }));
    app.use((req, res, next) => {
        res.locals.csrfToken = req.csrfToken();
        next();
    });
    app.get("/csrf-token", (req, res) => {
        if (req.headers.origin == "http://localhost:9000") {
            res.json({ csrfToken: req.csrfToken() });
        } else {
            res.status(403).send('Forbidden');
        }
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
}