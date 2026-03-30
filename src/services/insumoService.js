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
  const conn = await pool.getConnection()

  try {
    await conn.beginTransaction()

    const { name, unit, min_stock, is_active } = data

    // 🔥 1. cria insumo
    const [result] = await conn.query(`
      INSERT INTO insumos (name, unit, min_stock, is_active)
      VALUES (?, ?, ?, ?)
    `, [
      name,
      unit || 'und',
      min_stock || 0,
      is_active ?? 1
    ])

    const insumoId = result.insertId

    // 🔥 2. cria estoque automático
    await conn.query(`
      INSERT INTO stock (store_id, item_id, item_type, quantity, created_at, updated_at)
      VALUES (?, ?, 'INSUMO', 0, NOW(), NOW())
    `, [
      1, // depois pode vir do usuário
      insumoId
    ])

    await conn.commit()

    return { id: insumoId, ...data }

  } catch (error) {
    await conn.rollback()
    console.error(error)
    throw error
  } finally {
    conn.release()
  }
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
  const conn = await pool.getConnection()

  try {
    await conn.beginTransaction()

    // 🔥 1. remove vínculo com produtos
    await conn.query(
      'DELETE FROM product_insumos WHERE insumo_id = ?',
      [id]
    )

    // 🔥 2. remove do estoque
    await conn.query(
      'DELETE FROM stock WHERE item_id = ? AND item_type = "INSUMO"',
      [id]
    )

    // 🔥 3. remove insumo
    await conn.query(
      'DELETE FROM insumos WHERE id = ?',
      [id]
    )

    await conn.commit()

    return { message: 'Insumo deletado com sucesso' }

  } catch (error) {
    await conn.rollback()
    console.error(error)
    throw error
  } finally {
    conn.release()
  }
}