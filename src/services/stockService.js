import pool from '../config/database.js'

// VER ESTOQUE ATUAL
export const getStock = async () => {
  const [rows] = await pool.query(`
    SELECT 
      s.*, 
      p.name AS product_name
    FROM stock s
    JOIN products p ON s.product_id = p.id
  `)

  return rows
}

// MOVIMENTAR ESTOQUE
export const movimentStock = async ({ product_id, quantity, type }) => {
  // 1. registra movimento
  await pool.query(`
    INSERT INTO stock_movements (product_id, quantity, type)
    VALUES (?, ?, ?)
  `, [product_id, quantity, type])

  // 2. verifica se já existe estoque
  const [rows] = await pool.query(
    'SELECT * FROM stock WHERE product_id = ?',
    [product_id]
  )

  if (rows.length === 0) {
    // cria estoque
    await pool.query(`
      INSERT INTO stock (product_id, quantity)
      VALUES (?, ?)
    `, [product_id, quantity])
  } else {
    // atualiza estoque
    const newQty = type === 'IN'
      ? rows[0].quantity + quantity
      : rows[0].quantity - quantity

    await pool.query(`
      UPDATE stock SET quantity = ?
      WHERE product_id = ?
    `, [newQty, product_id])
  }

  return { message: 'Movimentação realizada' }
}