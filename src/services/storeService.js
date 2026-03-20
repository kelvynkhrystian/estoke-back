import pool from '../config/database.js'

// LISTAR
export const getStores = async () => {
  const [rows] = await pool.query('SELECT * FROM stores')
  return rows
}

// CRIAR
export const createStore = async (name) => {
  const [result] = await pool.query(
    'INSERT INTO stores (name) VALUES (?)',
    [name]
  )

  return { id: result.insertId, name }
}