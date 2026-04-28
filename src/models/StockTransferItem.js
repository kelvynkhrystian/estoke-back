import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const StockTransferItem = sequelize.define(
  'StockTransferItem',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    transfer_id: { type: DataTypes.INTEGER, allowNull: false },
    item_id: { type: DataTypes.INTEGER, allowNull: true },
    quantity_sent: { type: DataTypes.INTEGER, allowNull: false },
    quantity_received: { type: DataTypes.INTEGER, allowNull: true },
    item_type: {
      type: DataTypes.ENUM('PRODUCT', 'INSUMO'),
      allowNull: false,
    },
  },
  {
    tableName: 'stock_transfer_items',
    timestamps: true,
    underscored: true,
  }
);

export default StockTransferItem;
