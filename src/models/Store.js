import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Store = sequelize.define(
  'Store',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    tableName: 'stores',
    timestamps: true,
    underscored: true,
  }
);

export default Store;
