import pool from '../config/database.js'

// CRIAR VENDA
export const createSale = async ({ items, store_id, created_by }) => {
  const conn = await pool.getConnection()

  try {
    await conn.beginTransaction()

    const [saleResult] = await conn.query(`
      INSERT INTO sales (store_id, created_by, total_amount)
      VALUES (?, ?, 0)
    `, [store_id, created_by])

    const saleId = saleResult.insertId
    let totalAmount = 0

    for (const item of items) {
      const { product_id, quantity, unit_price } = item

      if (!product_id || !quantity || !unit_price) {
        throw new Error('Item inválido')
      }

      totalAmount += quantity * unit_price

      await conn.query(`
        INSERT INTO sale_items (sale_id, product_id, quantity, unit_price)
        VALUES (?, ?, ?, ?)
      `, [saleId, product_id, quantity, unit_price])

      const [stockRows] = await conn.query(
        'SELECT * FROM stock WHERE product_id = ? AND store_id = ?',
        [product_id, store_id]
      )

      if (stockRows.length === 0) {
        throw new Error('Produto sem estoque nessa loja')
      }

      const newQty = stockRows[0].quantity - quantity

      if (newQty < 0) {
        throw new Error('Estoque insuficiente')
      }

      await conn.query(`
        UPDATE stock SET quantity = ?
        WHERE product_id = ? AND store_id = ?
      `, [newQty, product_id, store_id])

      await conn.query(`
        INSERT INTO stock_movements
        (product_id, store_id, quantity, type, created_by, reference_type, reference_id)
        VALUES (?, ?, ?, 'OUT', ?, 'SALE', ?)
      `, [product_id, store_id, quantity, created_by, saleId])
    }

    await conn.query(`
      UPDATE sales SET total_amount = ?
      WHERE id = ?
    `, [totalAmount, saleId])

    await conn.commit()

    return {
      message: 'Venda realizada com sucesso',
      sale_id: saleId,
      total: totalAmount
    }
  } catch (error) {
    await conn.rollback()
    throw error
  } finally {
    conn.release()
  }
}

// LISTAR VENDAS
export const getSales = async (store_id, role) => {
  let query = `
    SELECT s.*, u.name AS user_name
    FROM sales s
    JOIN users u ON s.created_by = u.id
  `
  const params = []

  if (role !== 'admin') {
    query += ' WHERE s.store_id = ?'
    params.push(store_id)
  }

  query += ' ORDER BY s.created_at DESC'

  const [rows] = await pool.query(query, params)
  return rows
}

// DETALHE DA VENDA
export const getSaleById = async (id, store_id, role) => {
  let query = 'SELECT * FROM sales WHERE id = ?'
  const params = [id]

  if (role !== 'admin') {
    query += ' AND store_id = ?'
    params.push(store_id)
  }

  const [saleRows] = await pool.query(query, params)

  if (saleRows.length === 0) {
    return null
  }

  const [items] = await pool.query(`
    SELECT si.*, p.name AS product_name
    FROM sale_items si
    JOIN products p ON si.product_id = p.id
    WHERE si.sale_id = ?
  `, [id])

  return {
    ...saleRows[0],
    items
  }
}