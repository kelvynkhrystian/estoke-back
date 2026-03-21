import mysql from 'mysql2/promise'

// NÃO precisa dotenv na Hostinger (ela já injeta env)
// se quiser manter local, pode deixar — não quebra

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

export default pool