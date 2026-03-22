import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  enableKeepAlive: true,
  connectTimeout: 10000
})

// 🔥 TESTE DE CONEXÃO (NÃO QUEBRA O APP)
export const testConnection = async () => {
  try {
    const conn = await pool.getConnection()
    await conn.query('SELECT 1')
    conn.release()

    console.log('✅ Banco conectado com sucesso')
  } catch (err) {
    console.error('❌ ERRO AO CONECTAR NO BANCO:', err.message)
  }
}

export default pool