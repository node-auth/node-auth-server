'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /** Add extensions */
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    /** Create table */
    await queryInterface.createTable('application_permissions', {
      application_permission_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      application_permission_uuid: {
        type: Sequelize.UUID,
        allowNull: false
      },
      application_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      permission_id: {
        type: Sequelize.INTEGER,
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
    await queryInterface.addIndex('application_permissions', ['application_permission_uuid'], {
      name: 'app_permissions_app_permission_uuid_idx',
      unique: true
    });
    await queryInterface.addIndex('application_permissions', ['application_id'], {
      name: 'app_permissions_application_id_idx'
    });
    await queryInterface.addIndex('application_permissions', ['permission_id'], {
      name: 'app_permissions_permission_id_idx'
    });
    /** Add foreign key constraints */
    await queryInterface.addConstraint('application_permissions', {
      name: 'app_permissions_appplication_id_fk',
      fields: ['application_id'],
      type: 'foreign key',
      references: {
        table: 'applications',
        field: 'application_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    await queryInterface.addConstraint('application_permissions', {
      name: 'app_permissions_permission_id_fk',
      fields: ['permission_id'],
      type: 'foreign key',
      references: {
        table: 'permissions',
        field: 'permission_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    await queryInterface.addConstraint('application_permissions', {
      name: 'app_permissions_created_by_fk',
      fields: ['created_by'],
      type: 'foreign key',
      references: {
        table: 'users',
        field: 'user_id'
      },
      onUpdate: 'SET NULL',
      onDelete: 'SET NULL'
    });
    await queryInterface.addConstraint('application_permissions', {
      name: 'app_permissions_updated_by_fk',
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
    await queryInterface.removeConstraint('application_permissions', 'app_permissions_appplication_id_fk');
    await queryInterface.removeConstraint('application_permissions', 'app_permissions_permission_id_fk');
    await queryInterface.removeConstraint('application_permissions', 'app_permissions_created_by_fk');
    await queryInterface.removeConstraint('application_permissions', 'app_permissions_updated_by_fk');
    /** Remove indexes */
    await queryInterface.removeIndex('application_permissions', 'app_permissions_app_permission_uuid_idx');
    await queryInterface.removeIndex('application_permissions', 'app_permissions_application_id_idx');
    await queryInterface.removeIndex('application_permissions', 'app_permissions_permission_id_idx');
    /** Drop table */
    await queryInterface.dropTable('application_permissions');
  }
};