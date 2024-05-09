'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /** Add extensions */
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    /** Create table */
    await queryInterface.createTable('users', {
      user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      user_uuid: {
        type: Sequelize.UUID,
        allowNull: false
      },
      username: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      full_name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      first_name: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      middle_name: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      last_name: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      nickname: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      email: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      birthdate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      address: {
        type: Sequelize.STRING(1024),
        allowNull: true
      },
      gender: {
        type: Sequelize.STRING(10),
        allowNull: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      is_email_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      is_phone_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      is_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      is_two_factor_enabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      is_lockout: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      lockout_end: {
        type: Sequelize.DATE,
        allowNull: true
      },
      access_failed_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      extended_info: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {}
      },
      organization_id: {
        type: Sequelize.INTEGER,
        allowNull: true
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
    await queryInterface.addIndex('users', ['user_uuid'], {
      name: 'users_user_uuid_idx',
      unique: true
    });
    await queryInterface.addIndex('users', ['organization_id'], {
      name: 'users_organization_id_idx'
    });
    /** Add foreign key constraints */
    await queryInterface.addConstraint('users', {
      name: 'users_organization_id_fk',
      fields: ['organization_id'],
      type: 'foreign key',
      references: {
        table: 'organizations',
        field: 'organization_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    await queryInterface.addConstraint('users', {
      name: 'users_created_by_fk',
      fields: ['created_by'],
      type: 'foreign key',
      references: {
        table: 'users',
        field: 'user_id'
      },
      onUpdate: 'SET NULL',
      onDelete: 'SET NULL'
    });
    await queryInterface.addConstraint('users', {
      name: 'users_updated_by_fk',
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
    await queryInterface.removeConstraint('users', 'users_created_by_fk');
    await queryInterface.removeConstraint('users', 'users_updated_by_fk');
    await queryInterface.removeConstraint('users', 'users_organization_id_fk');
    /** Remove indexes */
    await queryInterface.removeIndex('users', 'users_user_uuid_idx');
    await queryInterface.removeIndex('users', 'users_organization_id_idx');
    /** Drop table */
    await queryInterface.dropTable('users');
  }
};