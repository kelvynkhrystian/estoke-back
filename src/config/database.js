import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    dialect: 'mysql',

    logging: false, // ou console.log se quiser ver queries

    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

// 🔥 TESTE DE CONEXÃO
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Sequelize conectado com sucesso');
  } catch (error) {
    console.error('❌ ERRO AO CONECTAR:', error.message);
  }
};

export default sequelize;
