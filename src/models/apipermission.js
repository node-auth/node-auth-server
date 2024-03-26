'use strict';
const {
  Model
} = require('sequelize');
const User = require('./user');
const Api = require('./api');
const Permission = require('./permission');
module.exports = (sequelize, DataTypes) => {
  class ApiPermission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ApiPermission.belongsTo(models.Api, { foreignKey: 'api_id' });
      ApiPermission.belongsTo(models.Permission, { foreignKey: 'permission_id' });
      ApiPermission.belongsTo(models.User, { foreignKey: 'created_by' });
      ApiPermission.belongsTo(models.User, { foreignKey: 'updated_by' });
    }
  }
  ApiPermission.init({
    api_permission_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    api_permission_uuid: {
      type: DataTypes.UUID,
      allowNull: true
    },
    api_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Api,
        key: 'api_id'
      }
    },
    permission_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Permission,
        key: 'permission_id'
      }
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
    modelName: 'ApiPermission',
    tableName: 'api_permissions',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    timestamps: false
  });
  return ApiPermission;
};