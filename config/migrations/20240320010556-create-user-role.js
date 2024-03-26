'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /** Add extensions */
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    /** Create table */
    await queryInterface.createTable('user_roles', {
      user_role_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      user_role_uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      role_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
      }
    });
    /** Add indexes reference */
    await queryInterface.addIndex('user_roles', ['user_role_uuid'], {
      name: 'user_roles_user_role_uuid_idx',
      unique: true
    });
    await queryInterface.addIndex('user_roles', ['user_id'], {
      name: 'user_roles_user_id_idx'
    });
    await queryInterface.addIndex('user_roles', ['role_id'], {
      name: 'user_roles_role_id_idx'
    });
    /** Add foreign key constraints */
    await queryInterface.addConstraint('user_roles', {
      name: 'user_roles_user_id_fk',
      fields: ['user_id'],
      type: 'foreign key',
      references: {
        table: 'users',
        field: 'user_id'
      },
      onUpdate: 'SET NULL',
      onDelete: 'SET NULL'
    });
    await queryInterface.addConstraint('user_roles', {
      name: 'user_roles_role_id_fk',
      fields: ['role_id'],
      type: 'foreign key',
      references: {
        table: 'roles',
        field: 'role_id'
      },
      onUpdate: 'SET NULL',
      onDelete: 'SET NULL'
    });
    await queryInterface.addConstraint('user_roles', {
      name: 'user_roles_created_by_fk',
      fields: ['created_by'],
      type: 'foreign key',
      references: {
        table: 'users',
        field: 'user_id'
      },
      onUpdate: 'SET NULL',
      onDelete: 'SET NULL'
    });
    await queryInterface.addConstraint('user_roles', {
      name: 'user_roles_updated_by_fk',
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
    await queryInterface.removeConstraint('user_roles', 'user_roles_user_id_fk');
    await queryInterface.removeConstraint('user_roles', 'user_roles_role_id_fk');
    await queryInterface.removeConstraint('user_roles', 'user_roles_created_by_fk');
    await queryInterface.removeConstraint('user_roles', 'user_roles_updated_by_fk');
    /** Remove indexes */
    await queryInterface.removeIndex('user_roles', 'user_roles_user_role_uuid_idx');
    await queryInterface.removeIndex('user_roles', 'user_roles_user_id_idx');
    await queryInterface.removeIndex('user_roles', 'user_roles_role_id_idx');
    /** Drop table */
    await queryInterface.dropTable('user_roles');
  }
};