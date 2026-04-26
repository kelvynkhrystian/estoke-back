'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('stock_transfers', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      from_store_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'stores',
          key: 'id',
        },
      },
      to_store_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'stores',
          key: 'id',
        },
      },
      status: {
        type: Sequelize.ENUM('PENDING', 'COMPLETED', 'CANCELLED'),
        allowNull: true,
        defaultValue: 'PENDING',
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      confirmed_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
        ),
      },
      confirmed_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    await queryInterface.addIndex('stock_transfers', ['from_store_id'], {
      name: 'from_store_id',
    });

    await queryInterface.addIndex('stock_transfers', ['to_store_id'], {
      name: 'to_store_id',
    });

    await queryInterface.addIndex('stock_transfers', ['created_by'], {
      name: 'created_by',
    });

    await queryInterface.addIndex('stock_transfers', ['confirmed_by'], {
      name: 'confirmed_by',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('stock_transfers');
  },
};
