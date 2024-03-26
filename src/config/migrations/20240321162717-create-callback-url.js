'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /** Add extensions */
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    /** Create table */
    await queryInterface.createTable('callback_urls', {
      callback_url_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      callback_url_uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        allowNull: true
      },
      url: {
        type: Sequelize.STRING(1024),
        allowNull: false
      },
      application_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      is_default: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      updated_by: {
        type: Sequelize.INTEGER,
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
      }
    });
    /** Add indexes reference */
    await queryInterface.addIndex('callback_urls', ['callback_url_uuid'], {
      name: 'callback_urls_callback_url_uuid_idx',
      unique: true
    });
    await queryInterface.addIndex('callback_urls', ['application_id'], {
      name: 'callback_urls_application_id_idx'
    });
    /** Add foreign key constraints */
    await queryInterface.addConstraint('callback_urls', {
      name: 'callback_urls_application_id_fk',
      fields: ['application_id'],
      type: 'foreign key',
      references: {
        table: 'applications',
        field: 'application_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    await queryInterface.addConstraint('callback_urls', {
      name: 'callback_urls_created_by_fk',
      fields: ['created_by'],
      type: 'foreign key',
      references: {
        table: 'users',
        field: 'user_id'
      },
      onUpdate: 'SET NULL',
      onDelete: 'SET NULL'
    });
    await queryInterface.addConstraint('callback_urls', {
      name: 'callback_urls_updated_by_fk',
      fields: ['updated_by'],
      type: 'foreign key',
      references: {
        table: 'users',
        field: 'user_id'
      },
      onUpdate: 'SET NULL',
      onDelete: 'SET NULL'
    });
  },
  async down(queryInterface, Sequelize) {
    /** Remove the foreign key constraints */
    await queryInterface.removeConstraint('callback_urls', 'callback_urls_application_id_fk');
    await queryInterface.removeConstraint('callback_urls', 'callback_urls_created_by_fk');
    await queryInterface.removeConstraint('callback_urls', 'callback_urls_updated_by_fk');
    /** Remove indexes */
    await queryInterface.removeIndex('callback_urls', 'callback_urls_callback_url_uuid_idx');
    await queryInterface.removeIndex('callback_urls', 'callback_urls_application_id_idx');
    /** Drop table */
    await queryInterface.dropTable('callback_urls');
  }
};