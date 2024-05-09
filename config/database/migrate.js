const { Sequelize, DataTypes } = require('sequelize');
const process = require('process');
const env = process.env.NODE_ENV || 'development';
const config = require('./config')[env];
const models = require('../../models');

let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

models.init(sequelize); // Initialize models with Sequelize instance

(async () => {
    try {
        await sequelize.sync({ force: true }); // Consider using migrations for production
        console.log("Migrations completed successfully!");
    } catch (err) {
        console.error("Error migrating database:", err);
        process.exit(1);
    }
})();
