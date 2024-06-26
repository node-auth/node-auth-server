const devRoutes = require('../modules/dev/devRoutes');
const authRoutes = require('../modules/auth/routes/authRoutes');
const oauth2V1Routes = require('../modules/auth/routes/oauth2Routes');
const userRoutes = require('../modules/auth/routes/userRoutes');
const profileRoutes = require('../modules/auth/routes/profileRoutes');

module.exports = (app) => {
	app.use('/dev', devRoutes);
	/** Authentication endpoint */
	app.use('/auth', authRoutes);
	app.use('/oauth/v1', oauth2V1Routes);
	/** Resource endpoints */
	app.use('/api/v1/users', userRoutes);
	app.use('/api/v1/profile', profileRoutes);
}