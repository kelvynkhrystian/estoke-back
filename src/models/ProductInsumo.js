import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ProductInsumo = sequelize.define(
  'ProductInsumo',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    insumo_id: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  },
  {
    tableName: 'product_insumos',
    timestamps: false,
    createdAt: 'created_at',
    updatedAt: false,
    underscored: true,
  }
);

export default ProductInsumo;
