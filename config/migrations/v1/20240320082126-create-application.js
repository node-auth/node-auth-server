'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /** Add extensions */
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    /** Create table */
    await queryInterface.createTable('applications', {
      application_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      application_uuid: {
        type: Sequelize.UUID,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      description: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      domain: {
        type: Sequelize.STRING(512),
        allowNull: false
      },
      client_id: {
        type: Sequelize.STRING(512),
        allowNull: false
      },
      client_secret: {
        type: Sequelize.STRING(1024),
        allowNull: false
      },
      application_type: {
        type: Sequelize.STRING(10),
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
    await queryInterface.addIndex('applications', ['application_uuid'], {
      name: 'applications_application_uuid_idx',
      unique: true
    });
    await queryInterface.addIndex('applications', ['domain'], {
      name: 'applications_domain_idx'
    });
    await queryInterface.addIndex('applications', ['client_id'], {
      name: 'applications_client_id_idx',
      unique: true
    });
    await queryInterface.addIndex('applications', ['client_secret'], {
      name: 'applications_client_secret_idx',
      unique: true
    });
    await queryInterface.addIndex('applications', ['organization_id'], {
      name: 'applications_organization_id_idx'
    });
    /** Add foreign key constraints */
    await queryInterface.addConstraint('applications', {
      name: 'applications_organization_id_fk',
      fields: ['organization_id'],
      type: 'foreign key',
      references: {
        table: 'organizations',
        field: 'organization_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    await queryInterface.addConstraint('applications', {
      name: 'applications_created_by_fk',
      fields: ['created_by'],
      type: 'foreign key',
      references: {
        table: 'users',
        field: 'user_id'
      },
      onUpdate: 'SET NULL',
      onDelete: 'SET NULL'
    });
    await queryInterface.addConstraint('applications', {
      name: 'applications_updated_by_fk',
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
    await queryInterface.removeConstraint('applications', 'applications_created_by_fk');
    await queryInterface.removeConstraint('applications', 'applications_updated_by_fk');
    await queryInterface.removeConstraint('applications', 'applications_organization_id_fk');
    /** Remove indexes */
    await queryInterface.removeIndex('applications', 'applications_application_uuid_idx');
    await queryInterface.removeIndex('applications', 'applications_domain_idx');
    await queryInterface.removeIndex('applications', 'applications_client_id_idx');
    await queryInterface.removeIndex('applications', 'applications_client_secret_idx');
    await queryInterface.removeIndex('applications', 'applications_organization_id_idx');
    /** Drop table */
    await queryInterface.dropTable('applications');
  }
};