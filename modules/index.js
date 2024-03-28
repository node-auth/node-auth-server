const devRoutes = require('./dev/devRoutes');
const authRoutes = require('./auth/routes/authRoutes');
const oauth2V1Routes = require('./auth/routes/oauth2Routes');
const userRoutes = require('./auth/routes/userRoutes');

module.exports = (app) => {
    app.use('/dev', devRoutes);
    /** Authentication endpoint */
    app.use('/auth', authRoutes);
    app.use('/oauth/v1', oauth2V1Routes);
    /** Resource endpoints */
    app.use('/api/v1/users', userRoutes);
}