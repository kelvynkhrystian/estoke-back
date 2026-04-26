'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('stock_movements', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      store_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'stores',
          key: 'id',
        },
      },
      type: {
        type: Sequelize.ENUM('IN', 'OUT', 'ADJUST'),
        allowNull: false,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      reference_type: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      reference_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
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
      reason: {
        type: Sequelize.ENUM(
          'COMPRA',
          'VENDA',
          'PERDA',
          'AJUSTE_POSITIVO',
          'AJUSTE_NEGATIVO',
          'TRANSFERENCIA',
          'PRODUCAO',
          'CONSUMO_INTERNO'
        ),
        allowNull: true,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      balance_after: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      item_type: {
        type: Sequelize.ENUM('PRODUCT', 'INSUMO'),
        allowNull: false,
      },
    });

    await queryInterface.addIndex('stock_movements', ['store_id'], {
      name: 'fk_mov_store',
    });

    await queryInterface.addIndex('stock_movements', ['created_by'], {
      name: 'fk_mov_user',
    });

    await queryInterface.addIndex('stock_movements', ['reference_id'], {
      name: 'reference_id',
    });

    await queryInterface.addIndex(
      'stock_movements',
      ['item_id', 'item_type', 'store_id'],
      {
        name: 'idx_movements_item',
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('stock_movements');
  },
};
