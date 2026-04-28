import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const StockTransfer = sequelize.define(
  'StockTransfer',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    from_store_id: { type: DataTypes.INTEGER, allowNull: false },
    to_store_id: { type: DataTypes.INTEGER, allowNull: false },
    status: {
      type: DataTypes.ENUM('PENDING', 'COMPLETED', 'CANCELLED'),
      defaultValue: 'PENDING',
    },
    created_by: { type: DataTypes.INTEGER, allowNull: false },
    confirmed_by: { type: DataTypes.INTEGER, allowNull: true },
    notes: { type: DataTypes.TEXT, allowNull: true },
    confirmed_at: { type: DataTypes.DATE, allowNull: true },
  },
  {
    tableName: 'stock_transfers',
    timestamps: true,
    underscored: true,
  }
);

export default StockTransfer;
