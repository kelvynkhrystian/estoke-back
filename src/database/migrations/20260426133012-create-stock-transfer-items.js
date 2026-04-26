'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('stock_transfer_items', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      transfer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'stock_transfers',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      quantity_sent: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      quantity_received: {
        type: Sequelize.INTEGER,
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
      item_type: {
        type: Sequelize.ENUM('PRODUCT', 'INSUMO'),
        allowNull: false,
      },
    });

    await queryInterface.addIndex('stock_transfer_items', ['transfer_id']);
    await queryInterface.addIndex('stock_transfer_items', ['item_id']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('stock_transfer_items');
  },
};
