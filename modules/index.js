const devRoutes = require('./dev/devRoutes');
const authRoutes = require('./auth/routes/authRoutes');
const oauth2V1Routes = require('./auth/routes/oauth2Routes');
const userRoutes = require('./auth/routes/userRoutes');

const { csrfProtection } = require('../utils/csrf-util');

module.exports = (app) => {
    app.use('/dev', devRoutes);
    /** Authentication endpoint */
    app.use('/auth', authRoutes);
    app.use('/oauth/v1', csrfProtection(process.env.CSRF_SECRET), oauth2V1Routes);
    /** Resource endpoints */
    app.use('/api/v1/users', userRoutes);
}