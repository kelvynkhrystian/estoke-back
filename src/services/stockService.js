import pool from '../config/database.js'

// 🔹 LISTAR ESTOQUE POR LOJA
export const getStock = async (store_id) => {
  const [rows] = await pool.query(`
    SELECT 
      s.*, 
      p.name AS product_name
    FROM stock s
    JOIN products p ON s.product_id = p.id
    WHERE s.store_id = ?
  `, [store_id])

  return rows
}

// 🔹 MOVIMENTAR ESTOQUE (PROFISSIONAL)
export const movimentStock = async ({
  product_id,
  store_id,
  quantity,
  type,
  created_by,
  reference_type = 'MANUAL',
  reference_id = null
}) => {
  const conn = await pool.getConnection()

  try {
    await conn.beginTransaction()

    // 1. verifica estoque atual
    const [rows] = await conn.query(
      'SELECT * FROM stock WHERE product_id = ? AND store_id = ?',
      [product_id, store_id]
    )

    let currentQty = 0

    if (rows.length === 0) {
      if (type === 'OUT') {
        throw new Error('Produto sem estoque')
      }

      // cria estoque inicial
      await conn.query(`
        INSERT INTO stock (product_id, store_id, quantity)
        VALUES (?, ?, ?)
      `, [product_id, store_id, quantity])

      currentQty = quantity

    } else {
      currentQty = rows[0].quantity

      const newQty =
        type === 'IN'
          ? currentQty + quantity
          : type === 'OUT'
          ? currentQty - quantity
          : quantity // ajuste direto

      if (newQty < 0) {
        throw new Error('Estoque insuficiente')
      }

      await conn.query(`
        UPDATE stock SET quantity = ?
        WHERE product_id = ? AND store_id = ?
      `, [newQty, product_id, store_id])
    }

    // 2. registra movimento 🔥
    await conn.query(`
      INSERT INTO stock_movements 
      (product_id, store_id, quantity, type, created_by, reference_type, reference_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      product_id,
      store_id,
      quantity,
      type,
      created_by,
      reference_type,
      reference_id
    ])

    await conn.commit()

    return { message: 'Movimentação realizada com sucesso' }

  } catch (error) {
    await conn.rollback()
    throw error
  } finally {
    conn.release()
  }
}

// 🔹 LISTAR MOVIMENTAÇÕES
export const getMovements = async (store_id) => {
  const [rows] = await pool.query(`
    SELECT 
      sm.*,
      p.name AS product_name,
      u.name AS user_name
    FROM stock_movements sm
    JOIN products p ON sm.product_id = p.id
    JOIN users u ON sm.created_by = u.id
    WHERE sm.store_id = ?
    ORDER BY sm.created_at DESC
  `, [store_id])

  return rows
}