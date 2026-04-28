import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Product = sequelize.define(
  'Product',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(150), allowNull: false },
    sku: { type: DataTypes.STRING(50), allowNull: true },
    unit: { type: DataTypes.STRING(20), allowNull: true },
    cost_price: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    sale_price: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    resale_price: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    min_stock: { type: DataTypes.INTEGER, defaultValue: 0 },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    category_id: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    tableName: 'products',
    timestamps: true,
    underscored: true,
  }
);

export default Product;
