'use strict';
const {
  Model
} = require('sequelize');
const User = require('./user');
const Application = require('./application');
const Permission = require('./permission');
module.exports = (sequelize, DataTypes) => {
  class ApplicationPermission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ApplicationPermission.belongsTo(models.Application, { foreignKey: 'application_id' });
      ApplicationPermission.belongsTo(models.Permission, { foreignKey: 'permission_id' });
      ApplicationPermission.belongsTo(models.User, { foreignKey: 'created_by' });
      ApplicationPermission.belongsTo(models.User, { foreignKey: 'updated_by' });
    }
  }
  ApplicationPermission.init({
    application_permission_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    application_permission_uuid: {
      type: DataTypes.UUID,
      allowNull: true
    },
    application_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Application,
        key: 'application_id'
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
    modelName: 'ApplicationPermission',
    tableName: 'application_permissions',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    timestamps: false
  });
  return ApplicationPermission;
};