'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /** Add extensions */
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    /** Create table */
    await queryInterface.createTable('user_auths', {
      user_auth_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      user_auth_uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        allowNull: false
      },
      password: {
        type: Sequelize.STRING(512),
        allowNull: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });
    /** Add indexes reference */
    await queryInterface.addIndex('user_auths', ['user_auth_uuid'], {
      name: 'user_auths_user_auth_uuid_idx',
      unique: true
    });
    await queryInterface.addIndex('user_auths', ['user_id'], {
      name: 'user_auths_user_id_idx'
    });
    /** Add foreign key constraints */
    await queryInterface.addConstraint('user_auths', {
      name: 'user_auths_user_id_fk',
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
    await queryInterface.removeConstraint('user_auths', 'user_auths_user_id_fk');
    /** Remove indexes */
    await queryInterface.removeIndex('user_auths', 'user_auths_user_auth_uuid_idx');
    await queryInterface.removeIndex('user_auths', 'user_auths_user_id_idx');
    /** Drop table */
    await queryInterface.dropTable('user_auths');
  }
};