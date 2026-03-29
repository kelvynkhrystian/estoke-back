import pool from '../config/database.js'

// 🔍 LISTAR LOJAS (ATIVAS + CONTAGEM DE USUÁRIOS)
export const getStores = async () => {
  const [rows] = await pool.query(`
    SELECT 
      s.id,
      s.name,
      s.is_active,
      COUNT(u.id) AS total_users
    FROM stores s
    LEFT JOIN users u ON u.store_id = s.id AND u.is_active = 1
    WHERE s.is_active = 1
    GROUP BY s.id
    ORDER BY s.id ASC
  `)

  return rows
}

// 🔍 BUSCAR POR ID
export const getStoreById = async (id) => {
  const [rows] = await pool.query(
    'SELECT * FROM stores WHERE id = ? AND is_active = 1',
    [id]
  )

  return rows[0] || null
}

// ➕ CRIAR LOJA
export const createStore = async (name) => {
  const [result] = await pool.query(
    'INSERT INTO stores (name, is_active) VALUES (?, 1)',
    [name]
  )

  return {
    id: result.insertId,
    name,
    is_active: 1,
    total_users: 0
  }
}

// ✏️ ATUALIZAR LOJA
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

// 🗑️ REMOVER (SOFT DELETE)
export const removeStore = async (id) => {
  const [result] = await pool.query(
    'UPDATE stores SET is_active = 0 WHERE id = ?',
    [id]
  )

  if (result.affectedRows === 0) {
    return null
  }

  return { id }
}