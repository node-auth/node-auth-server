'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /** Add extensions */
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    /** Create table */
    await queryInterface.createTable('permissions', {
      permission_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      permission_uuid: {
        type: Sequelize.UUID,
        allowNull: false
      },
      permission_identifier: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      permission_description: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      is_default: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      updated_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
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
    await queryInterface.addIndex('permissions', ['permission_uuid'], {
      name: 'permissions_permission_uuid_idx',
      unique: true
    });
    await queryInterface.addIndex('permissions', ['permission_identifier'], {
      name: 'permissions_permission_identifier_idx'
    });
    /** Add foreign key constraints */
    await queryInterface.addConstraint('permissions', {
      name: 'permissions_created_by_fk',
      fields: ['created_by'],
      type: 'foreign key',
      references: {
        table: 'users',
        field: 'user_id'
      },
      onUpdate: 'SET NULL',
      onDelete: 'SET NULL'
    });
    await queryInterface.addConstraint('permissions', {
      name: 'permissions_updated_by_fk',
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
    await queryInterface.removeConstraint('permissions', 'permissions_created_by_fk');
    await queryInterface.removeConstraint('permissions', 'permissions_updated_by_fk');
    /** Remove indexes */
    await queryInterface.removeIndex('permissions', 'permissions_permission_uuid_idx');
    await queryInterface.removeIndex('permissions', 'permissions_permission_identifier_idx');
    /** Drop table */
    await queryInterface.dropTable('permissions');
  }
};