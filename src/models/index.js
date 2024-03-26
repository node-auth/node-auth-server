'use strict';

// const fs = require('fs');
// const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const process = require('process');
// const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/database/config.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

/**
 * THIS IS THE CLI GENERATED
 * we are replacing these because intellisense is not working using this method
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
**/

/**
 * THIS IS MANUALLY CREATED
 * here we are manually creating the model below
 * this solves the problem with the intellisense
*/
db.User = require('./user')(sequelize, DataTypes);
db.UserAuth = require('./userauth')(sequelize, DataTypes);
db.UserRole = require('./userrole')(sequelize, DataTypes);
db.Role = require('./role')(sequelize, DataTypes);
db.Api = require('./api')(sequelize, DataTypes);
db.Permission = require('./permission')(sequelize, DataTypes);
db.ApiPermission = require('./apipermission')(sequelize, DataTypes);
db.UserPermission = require('./userpermission')(sequelize, DataTypes);
db.RolePermission = require('./rolepermission')(sequelize, DataTypes);
db.Application = require('./application')(sequelize, DataTypes);
db.ApplicationPermission = require('./applicationpermission')(sequelize, DataTypes);
db.AuthorizationCode = require('./authorizationcode')(sequelize, DataTypes);
db.UserToken = require('./usertoken')(sequelize, DataTypes);
db.CallbackUrl = require('./callbackurl')(sequelize, DataTypes);
db.Organization = require('./organization')(sequelize, DataTypes);
db.AccessToken = require('./accesstoken')(sequelize, DataTypes);
db.RefreshToken = require('./refreshtoken')(sequelize, DataTypes);
// Associate the ports
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
/** This is manually created */

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
