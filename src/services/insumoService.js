import pool from '../config/database.js'

// LISTAR
export const getAllInsumos = async () => {
  const [rows] = await pool.query('SELECT * FROM insumos')
  return rows
}

// BUSCAR POR ID
export const getInsumoById = async (id) => {
  const [rows] = await pool.query(
    'SELECT * FROM insumos WHERE id = ?',
    [id]
  )
  return rows[0]
}

// CRIAR
export const createInsumo = async (data) => {
  const { name, unit, min_stock, is_active } = data

  const [result] = await pool.query(`
    INSERT INTO insumos (name, unit, min_stock, is_active)
    VALUES (?, ?, ?, ?)
  `, [
    name,
    unit || 'und',
    min_stock || 0,
    is_active ?? 1
  ])

  return { id: result.insertId, ...data }
}

// UPDATE
export const updateInsumo = async (id, data) => {
  const { name, unit, min_stock, is_active } = data

  await pool.query(`
    UPDATE insumos SET
      name = ?,
      unit = ?,
      min_stock = ?,
      is_active = ?
    WHERE id = ?
  `, [
    name,
    unit,
    min_stock,
    is_active,
    id
  ])

  return { id, ...data }
}

// DELETE
export const deleteInsumo = async (id) => {
  await pool.query('DELETE FROM insumos WHERE id = ?', [id])
  return { message: 'Insumo deletado' }
}