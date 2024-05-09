'use strict';
const {
  Model
} = require('sequelize');
const User = require('./user');
const Organization = require('./organization');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Role.hasMany(models.UserRole, { foreignKey: 'role_id' });
      Role.belongsTo(models.User, { foreignKey: 'created_by' });
      Role.belongsTo(models.User, { foreignKey: 'updated_by' });
      Role.belongsTo(models.Organization, { foreignKey: 'organization_id' });
    }
  }
  Role.init({
    role_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    role_uuid: {
      type: DataTypes.UUID,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    is_default: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    organization_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Organization,
        key: 'organization_id'
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
    modelName: 'Role',
    tableName: 'roles',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    timestamps: false
  });
  return Role;
};