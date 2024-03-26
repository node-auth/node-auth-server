'use strict';
const {
  Model
} = require('sequelize');
const Organization = require('./organization');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // User to User (created_by, updated_by)
      User.belongsTo(models.User, { foreignKey: 'created_by' });
      User.belongsTo(models.User, { foreignKey: 'updated_by' });
      // User to Organization
      User.belongsTo(models.Organization, { foreignKey: 'organization_id' });
    }
  }
  User.init({
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    user_uuid: {
      type: DataTypes.UUID,
      unique: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    middle_name: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    nickname: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    birthdate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    gender: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    is_email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    is_phone_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    is_two_factor_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    is_lockout: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    lockout_end: {
      type: DataTypes.DATE,
      allowNull: true
    },
    access_failed_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    extended_info: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {}
    },
    organization_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    timestamps: false
  });
  return User;
};