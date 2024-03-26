'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('access_tokens', {
      access_token_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      access_token_uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        allowNull: false
      },
      access_token: {
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
      }
    });
    /** Add indexes reference */
    await queryInterface.addIndex('access_tokens', ['access_token_uuid'], {
      name: 'access_tokens_access_token_uuid_idx',
      unique: true
    });
    await queryInterface.addIndex('access_tokens', ['access_token'], {
      name: 'access_tokens_access_token_idx'
    });
    await queryInterface.addIndex('access_tokens', ['client_id'], {
      name: 'access_tokens_client_id_idx'
    });
    await queryInterface.addIndex('access_tokens', ['user_id'], {
      name: 'access_tokens_user_id_idx'
    });
    /** Add foreign key constraints */
    await queryInterface.addConstraint('access_tokens', {
      name: 'access_tokens_user_id_fk',
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
    await queryInterface.removeConstraint('access_tokens', 'access_tokens_user_id_fk');
    /** Remove indexes */
    await queryInterface.removeIndex('access_tokens', 'access_tokens_access_token_uuid_idx');
    await queryInterface.removeIndex('access_tokens', 'access_tokens_access_token_idx');
    await queryInterface.removeIndex('access_tokens', 'access_tokens_client_id_idx');
    await queryInterface.removeIndex('access_tokens', 'access_tokens_user_id_idx');
    /** Drop table */
    await queryInterface.dropTable('access_tokens');
  }
};