'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AuthorizationCode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AuthorizationCode.init({
    authorization_code_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    authorization_code_uuid: {
      type: DataTypes.UUID,
      allowNull: true
    },
    code: {
      type: DataTypes.STRING(512),
      allowNull: false
    },
    client_id: {
      type: DataTypes.STRING(512),
      allowNull: false
    },
    redirect_uri: {
      type: DataTypes.STRING(1024),
      allowNull: true
    },
    scope: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    code_challenge: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    code_challenge_method: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    response_type: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    state: {
      type: DataTypes.STRING(1024),
      allowNull: true,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true
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
    modelName: 'AuthorizationCode',
    tableName: 'authorization_codes',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    timestamps: false
  });
  return AuthorizationCode;
};