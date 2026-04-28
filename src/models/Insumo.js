import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Insumo = sequelize.define(
  'Insumo',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(255), allowNull: true },
    unit: { type: DataTypes.STRING(50), allowNull: true },
    min_stock: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    tableName: 'insumos',
    timestamps: false,
    createdAt: 'created_at',
    updatedAt: false,
    underscored: true,
  }
);

export default Insumo;
