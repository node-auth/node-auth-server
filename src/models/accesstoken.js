'use strict';
const {
  Model
} = require('sequelize');
const User = require('./user');
module.exports = (sequelize, DataTypes) => {
  class AccessToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      AccessToken.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }
  AccessToken.init({
    access_token_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    access_token_uuid: {
      type: DataTypes.UUID,
      allowNull: true
    },
    access_token: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    client_id: {
      type: DataTypes.STRING(512),
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: 'user_id'
      }
    },
    scope: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    issued_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'AccessToken',
    tableName: 'access_tokens',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    timestamps: false
  });
  return AccessToken;
};