'use strict';
const {
  Model
} = require('sequelize');
const User = require('./user');
const Role = require('./role');
module.exports = (sequelize, DataTypes) => {
  class UserRole extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserRole.belongsTo(models.User, { foreignKey: 'user_id' });
      UserRole.belongsTo(models.Role, { foreignKey: 'role_id' });
      UserRole.belongsTo(models.User, { foreignKey: 'created_by' });
      UserRole.belongsTo(models.User, { foreignKey: 'updated_by' });
    }
  }
  UserRole.init({
    user_role_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    user_role_uuid: {
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
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Role,
        key: 'role_id'
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
    modelName: 'UserRole',
    tableName: 'user_roles',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    timestamps: false
  });
  return UserRole;
};