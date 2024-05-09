'use strict';
const {
  Model
} = require('sequelize');
const User = require('./user');
const Role = require('./role');
const Permission = require('./permission');
module.exports = (sequelize, DataTypes) => {
  class RolePermission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      RolePermission.belongsTo(models.Role, { foreignKey: 'role_id' });
      RolePermission.belongsTo(models.Permission, { foreignKey: 'permission_id' });
      RolePermission.belongsTo(models.User, { foreignKey: 'created_by' });
      RolePermission.belongsTo(models.User, { foreignKey: 'updated_by' });
    }
  }
  RolePermission.init({
    role_permission_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    role_permission_uuid: {
      type: DataTypes.UUID,
      allowNull: true
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Role,
        key: 'role_id'
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
    modelName: 'RolePermission',
    tableName: 'role_permissions',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    timestamps: false
  });
  return RolePermission;
};