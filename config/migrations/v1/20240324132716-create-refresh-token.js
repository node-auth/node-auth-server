'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('refresh_tokens', {
      refresh_token_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      refresh_token_uuid: {
        type: Sequelize.UUID,
        allowNull: false
      },
      refresh_token: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      client_id: {
        type: Sequelize.STRING(512),
        allowNull: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      scope: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      issued_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
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
    await queryInterface.addIndex('refresh_tokens', ['refresh_token_uuid'], {
      name: 'refresh_tokens_refresh_token_uuid_idx',
      unique: true
    });
    await queryInterface.addIndex('refresh_tokens', ['refresh_token'], {
      name: 'refresh_tokens_refresh_token_idx'
    });
    await queryInterface.addIndex('refresh_tokens', ['client_id'], {
      name: 'refresh_tokens_client_id_idx'
    });
    await queryInterface.addIndex('refresh_tokens', ['user_id'], {
      name: 'refresh_tokens_user_id_idx'
    });
    /** Add foreign key constraints */
    await queryInterface.addConstraint('refresh_tokens', {
      name: 'refresh_tokens_user_id_fk',
      fields: ['user_id'],
      type: 'foreign key',
      references: {
        table: 'users',
        field: 'user_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },
  async down(queryInterface, Sequelize) {
    /** Remove the foreign key constraints */
    await queryInterface.removeConstraint('refresh_tokens', 'refresh_tokens_user_id_fk');
    /** Remove indexes */
    await queryInterface.removeIndex('refresh_tokens', 'refresh_tokens_refresh_token_uuid_idx');
    await queryInterface.removeIndex('refresh_tokens', 'refresh_tokens_refresh_token_idx');
    await queryInterface.removeIndex('refresh_tokens', 'refresh_tokens_client_id_idx');
    await queryInterface.removeIndex('refresh_tokens', 'refresh_tokens_user_id_idx');
    /** Drop table */
    await queryInterface.dropTable('refresh_tokens');
  }
};