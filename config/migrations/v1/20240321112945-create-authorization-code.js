'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /** Add extensions */
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    /** Create table */
    await queryInterface.createTable('authorization_codes', {
      authorization_code_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      authorization_code_uuid: {
        type: Sequelize.UUID,
        allowNull: false
      },
      code: {
        type: Sequelize.STRING(512),
        allowNull: false
      },
      client_id: {
        type: Sequelize.STRING(512),
        allowNull: false
      },
      redirect_uri: {
        type: Sequelize.STRING(1024),
        allowNull: true
      },
      scope: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      code_challenge: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      code_challenge_method: {
        type: Sequelize.STRING(5),
        allowNull: true
      },
      response_type: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      state: {
        type: Sequelize.STRING(1024),
        allowNull: true,
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      metadata: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: {
          version: 0
        }
      }
    });
    /** Add indexes reference */
    await queryInterface.addIndex('authorization_codes', ['authorization_code_uuid'], {
      name: 'authorization_codes_authorization_code_uuid_idx',
      unique: true
    });
    await queryInterface.addIndex('authorization_codes', ['code'], {
      name: 'authorization_codes_code_idx'
    });
    await queryInterface.addIndex('authorization_codes', ['client_id'], {
      name: 'authorization_client_id_idx'
    });
  },
  async down(queryInterface, Sequelize) {
    /** Remove indexes */
    await queryInterface.removeIndex('authorization_codes', 'authorization_codes_authorization_code_uuid_idx');
    await queryInterface.removeIndex('authorization_codes', 'authorization_codes_code_idx');
    await queryInterface.removeIndex('authorization_codes', 'authorization_client_id_idx');
    /** Drop table */
    await queryInterface.dropTable('authorization_codes');
  }
};