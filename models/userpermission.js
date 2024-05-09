'use strict';
const {
  Model
} = require('sequelize');
const User = require('./user');
const Permission = require('./permission');
module.exports = (sequelize, DataTypes) => {
  class UserPermission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserPermission.belongsTo(models.User, { foreignKey: 'user_id' });
      UserPermission.belongsTo(models.Permission, { foreignKey: 'permission_id' });
      UserPermission.belongsTo(models.User, { foreignKey: 'created_by' });
      UserPermission.belongsTo(models.User, { foreignKey: 'updated_by' });
    }
  }
  UserPermission.init({
    user_permission_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    user_permission_uuid: {
      type: DataTypes.UUID,
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'user_id'
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
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {
        version: 0
      }
    }
  }, {
    sequelize,
    modelName: 'UserPermission',
    tableName: 'user_permissions',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    timestamps: false
  });
  return UserPermission;
};