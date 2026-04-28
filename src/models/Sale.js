import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Sale = sequelize.define(
  'Sale',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    store_id: { type: DataTypes.INTEGER, allowNull: true },
    total_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    created_by: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    tableName: 'sales',
    timestamps: true,
    underscored: true,
  }
);

export default Sale;
