import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Stock = sequelize.define(
  'Stock',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    store_id: { type: DataTypes.INTEGER, allowNull: false },
    item_id: { type: DataTypes.INTEGER, allowNull: false },
    item_type: {
      type: DataTypes.ENUM('PRODUCT', 'INSUMO'),
      allowNull: false,
    },
    quantity: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  },
  {
    tableName: 'stock',
    timestamps: true,
    underscored: true,
  }
);

export default Stock;
