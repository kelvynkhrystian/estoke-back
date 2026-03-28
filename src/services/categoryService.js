import pool from '../config/database.js'

// ============================
// LISTAR
// ============================
export const getAllCategories = async () => {
  const [rows] = await pool.query('SELECT * FROM categories')
  return rows
}

// ============================
// BUSCAR POR ID
// ============================
export const getCategoryById = async (id) => {
  const [rows] = await pool.query(
    'SELECT * FROM categories WHERE id = ?',
    [id]
  )
  return rows[0]
}

// ============================
// CRIAR
// ============================
export const createCategory = async (data) => {
  const name = data.name
  const is_active = data.is_active ?? 1

  const [result] = await pool.query(`
    INSERT INTO categories (name, is_active)
    VALUES (?, ?)
  `, [
    name,
    is_active
  ])

  return { id: result.insertId, name, is_active }
}

// ============================
// UPDATE
// ============================
export const updateCategory = async (id, data) => {
  const name = data.name
  const is_active = data.is_active ?? 1

  await pool.query(`
    UPDATE categories SET
      name = ?,
      is_active = ?
    WHERE id = ?
  `, [
    name,
    is_active,
    id
  ])

  return { id, name, is_active }
}

// ============================
// DELETE
// ============================
export const deleteCategory = async (id) => {
  await pool.query(
    'DELETE FROM categories WHERE id = ?',
    [id]
  )

  return { message: 'Categoria deletada' }
}