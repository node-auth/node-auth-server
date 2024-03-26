'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_tokens', {
      user_token_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      user_token_uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(10),
        allowNull: false
      },
      value: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      status: {
        type: Sequelize.STRING(10),
        allowNull: true
      },
      user_id: {
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
    await queryInterface.addIndex('user_tokens', ['user_token_uuid'], {
      name: 'user_tokens_user_token_uuid_idx',
      unique: true
    });
    await queryInterface.addIndex('user_tokens', ['value'], {
      name: 'user_tokens_value_idx'
    });
    await queryInterface.addIndex('user_tokens', ['user_id'], {
      name: 'user_tokens_user_id_idx'
    });
    /** Add foreign key constraints */
    await queryInterface.addConstraint('user_tokens', {
      name: 'user_tokens_user_id_fk',
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
    await queryInterface.removeConstraint('user_tokens', 'user_tokens_user_id_fk');
    /** Remove indexes */
    await queryInterface.removeIndex('user_tokens', 'user_tokens_user_token_uuid_idx');
    await queryInterface.removeIndex('user_tokens', 'user_tokens_value_idx');
    await queryInterface.removeIndex('user_tokens', 'user_tokens_user_id_idx');
    /** Drop table */
    await queryInterface.dropTable('user_tokens');
  }
};