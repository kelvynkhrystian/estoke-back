'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sale_items', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      sale_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'sales',
          key: 'id',
        },
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'products',
          key: 'id',
        },
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      unit_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      price_type: {
        type: Sequelize.ENUM('normal', 'resale', 'custom'),
        allowNull: true,
        defaultValue: 'normal',
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
    });

    await queryInterface.addIndex('sale_items', ['sale_id'], {
      name: 'sale_id',
    });

    await queryInterface.addIndex('sale_items', ['product_id'], {
      name: 'product_id',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('sale_items');
  },
};
