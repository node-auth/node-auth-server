'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /** Add extensions */
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    /** Create table */
    await queryInterface.createTable('roles', {
      role_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      role_uuid: {
        type: Sequelize.UUID,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      code: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      is_default: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      organization_id: {
        type: Sequelize.INTEGER,
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
    await queryInterface.addIndex('roles', ['role_uuid'], {
      name: 'roles_role_uuid_idx',
      unique: true
    });
    await queryInterface.addIndex('roles', ['code'], {
      name: 'roles_code_idx'
    });
    await queryInterface.addIndex('roles', ['organization_id'], {
      name: 'roles_organization_id_idx'
    });
    /** Add foreign key constraints */
    await queryInterface.addConstraint('roles', {
      name: 'roles_organization_id_fk',
      fields: ['organization_id'],
      type: 'foreign key',
      references: {
        table: 'organizations',
        field: 'organization_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    await queryInterface.addConstraint('roles', {
      name: 'roles_created_by_fk',
      fields: ['created_by'],
      type: 'foreign key',
      references: {
        table: 'users',
        field: 'user_id'
      },
      onUpdate: 'SET NULL',
      onDelete: 'SET NULL'
    });
    await queryInterface.addConstraint('roles', {
      name: 'roles_updated_by_fk',
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
    await queryInterface.removeConstraint('roles', 'roles_created_by_fk');
    await queryInterface.removeConstraint('roles', 'roles_updated_by_fk');
    await queryInterface.removeConstraint('roles', 'roles_organization_id_fk');
    /** Remove indexes */
    await queryInterface.removeIndex('roles', 'roles_role_uuid_idx');
    await queryInterface.removeIndex('roles', 'roles_code_idx');
    await queryInterface.removeIndex('roles', 'roles_organization_id_idx');
    /** Drop table */
    await queryInterface.dropTable('roles');
  }
};