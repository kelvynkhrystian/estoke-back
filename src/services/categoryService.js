import pool from '../config/database.js'

// LISTAR
export const getAllCategories = async () => {
  const [rows] = await pool.query('SELECT * FROM categories')
  return rows
}

// BUSCAR POR ID
export const getById = async (id) => {
  const [rows] = await pool.query(
    'SELECT * FROM categories WHERE id = ?',
    [id]
  )
  return rows[0]
}

// CRIAR
export const createCategory = async (name) => {
  const [result] = await pool.query(
    'INSERT INTO categories (name) VALUES (?)',
    [name]
  )

  return { id: result.insertId, name }
}

// ATUALIZAR
export const updateCategory = async (id, name) => {
  await pool.query(
    'UPDATE categories SET name = ? WHERE id = ?',
    [name, id]
  )

  return { id, name }
}

// DELETAR
export const deleteCategory = async (id) => {
  await pool.query(
    'DELETE FROM categories WHERE id = ?',
    [id]
  )

  return { message: 'Categoria deletada' }
}