import pool from '../config/database.js'

// LISTAR (somente ativos)
export const getStores = async () => {
  const [rows] = await pool.query(
    'SELECT * FROM stores WHERE is_active = 1'
  )
  return rows
}

// CRIAR
export const createStore = async (name) => {
  const [result] = await pool.query(
    'INSERT INTO stores (name) VALUES (?)',
    [name]
  )

  return {
    id: result.insertId,
    name
  }
}

// ATUALIZAR
export const updateStore = async (id, name) => {
  const [result] = await pool.query(
    'UPDATE stores SET name = ? WHERE id = ? AND is_active = 1',
    [name, id]
  )

  if (result.affectedRows === 0) {
    return null
  }

  return {
    id,
    name
  }
}

// REMOVER (SOFT DELETE 🔥)
export const removeStore = async (id) => {
  const [result] = await pool.query('DELETE FROM stores WHERE id = ?', [id])

  if (result.affectedRows === 0) {
    return null
  }

  return { id }
}