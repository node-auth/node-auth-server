'use strict';
const {
  Model
} = require('sequelize');
const User = require('./user');
const Application = require('./application');
module.exports = (sequelize, DataTypes) => {
  class CallbackUrl extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CallbackUrl.init({
    callback_url_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    callback_url_uuid: {
      type: DataTypes.UUID,
      allowNull: true
    },
    url: {
      type: DataTypes.STRING(1024),
      allowNull: false
    },
    application_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Application,
        key: 'application_id'
      }
    },
    is_default: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: 'user_id'
      }
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: 'user_id'
      }
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'CallbackUrl',
    tableName: 'callback_urls',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    timestamps: false
  });
  return CallbackUrl;
};