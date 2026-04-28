import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const RefreshToken = sequelize.define(
  'RefreshToken',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    token: { type: DataTypes.TEXT, allowNull: false },
    expires_at: { type: DataTypes.DATE, allowNull: true },
  },
  {
    tableName: 'refresh_tokens',
    timestamps: false,
    createdAt: 'created_at',
    updatedAt: false,
    underscored: true,
  }
);

export default RefreshToken;
