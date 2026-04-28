import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const AppConfig = sequelize.define(
  'AppConfig',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    app_name: { type: DataTypes.STRING(150), allowNull: true },
    slogan: { type: DataTypes.STRING(255), allowNull: true },
    theme: { type: DataTypes.STRING(50), defaultValue: 'light' },
    logo_url: { type: DataTypes.TEXT, allowNull: true },
    primary_color: { type: DataTypes.STRING(20), allowNull: true },
    secondary_color: { type: DataTypes.STRING(20), allowNull: true },
  },
  {
    tableName: 'app_config',
    timestamps: true,
    underscored: true,
  }
);

export default AppConfig;
