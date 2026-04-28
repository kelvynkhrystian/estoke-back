import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const StockMovement = sequelize.define(
  'StockMovement',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    store_id: { type: DataTypes.INTEGER, allowNull: false },
    type: {
      type: DataTypes.ENUM('IN', 'OUT', 'ADJUST'),
      allowNull: false,
    },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    reference_type: { type: DataTypes.STRING(50), allowNull: true },
    reference_id: { type: DataTypes.INTEGER, allowNull: true },
    created_by: { type: DataTypes.INTEGER, allowNull: false },
    reason: {
      type: DataTypes.ENUM(
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
    notes: { type: DataTypes.TEXT, allowNull: true },
    balance_after: { type: DataTypes.INTEGER, allowNull: true },
    item_id: { type: DataTypes.INTEGER, allowNull: false },
    item_type: {
      type: DataTypes.ENUM('PRODUCT', 'INSUMO'),
      allowNull: false,
    },
  },
  {
    tableName: 'stock_movements',
    timestamps: true,
    underscored: true,
  }
);

export default StockMovement;
