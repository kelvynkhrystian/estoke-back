import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const SaleItem = sequelize.define(
  'SaleItem',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    sale_id: { type: DataTypes.INTEGER, allowNull: true },
    product_id: { type: DataTypes.INTEGER, allowNull: true },
    quantity: { type: DataTypes.INTEGER, allowNull: true },
    unit_price: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    price_type: {
      type: DataTypes.ENUM('normal', 'resale', 'custom'),
      defaultValue: 'normal',
    },
  },
  {
    tableName: 'sale_items',
    timestamps: true,
    underscored: true,
  }
);

export default SaleItem;
