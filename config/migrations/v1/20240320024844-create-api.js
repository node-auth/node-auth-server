'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /** Add extensions */
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    /** Create table */
    await queryInterface.createTable('apis', {
      api_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      api_uuid: {
        type: Sequelize.UUID,
        allowNull: false
      },
      api_name: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      api_identifier: {
        type: Sequelize.STRING(512),
        allowNull: false
      },
      api_type: {
        type: Sequelize.STRING(10),
        allowNull: false
      },
      is_default: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
    await queryInterface.addIndex('apis', ['api_uuid'], {
      name: 'apis_api_uuid_idx',
      unique: true
    });
    await queryInterface.addIndex('apis', ['api_identifier'], {
      name: 'apis_api_identifier_idx'
    });
    await queryInterface.addIndex('apis', ['organization_id'], {
      name: 'apis_organization_id_idx'
    });
    /** Add foreign key constraints */
    await queryInterface.addConstraint('apis', {
      name: 'apis_organization_id_fk',
      fields: ['organization_id'],
      type: 'foreign key',
      references: {
        table: 'organizations',
        field: 'organization_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    await queryInterface.addConstraint('apis', {
      name: 'apis_created_by_fk',
      fields: ['created_by'],
      type: 'foreign key',
      references: {
        table: 'users',
        field: 'user_id'
      },
      onUpdate: 'SET NULL',
      onDelete: 'SET NULL'
    });
    await queryInterface.addConstraint('apis', {
      name: 'apis_updated_by_fk',
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
    await queryInterface.removeConstraint('apis', 'apis_updated_by_fk');
    await queryInterface.removeConstraint('apis', 'apis_created_by_fk');
    await queryInterface.removeConstraint('apis', 'apis_organization_id_fk');
    /** Remove indexes */
    await queryInterface.removeIndex('apis', 'apis_api_uuid_idx');
    await queryInterface.removeIndex('apis', 'apis_api_identifier_idx');
    await queryInterface.removeIndex('apis', 'apis_organization_id_idx');
    /** Drop table */
    await queryInterface.dropTable('apis');
  }
};