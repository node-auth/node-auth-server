const devRoutes = require('../modules/dev/devRoutes');
const authRoutes = require('../modules/auth/routes/authRoutes');
const oauth2V1Routes = require('../modules/auth/routes/oauth2V1Routes');
const userRoutes = require('../modules/auth/routes/userRoutes');

module.exports = (app) => {
    app.use('/dev', devRoutes);
    /** Authentication endpoint */
    app.use('/auth', authRoutes);
    app.use('/oauth/v1', oauth2V1Routes);
    app.use('/oauth/v2', oauth2V1Routes);
    /** Resource endpoints */
    app.use('/api/v1/users', userRoutes);
}