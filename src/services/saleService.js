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
      // 🔥 Adicionamos o price_type aqui
      const { product_id, quantity, unit_price, price_type } = item 

      if (!product_id || !quantity || unit_price === undefined) {
        throw new Error('Item inválido')
      }

      totalAmount += quantity * unit_price

      // 🔥 INSERT agora inclui o price_type
      await conn.query(`
        INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, price_type)
        VALUES (?, ?, ?, ?, ?)
      `, [saleId, product_id, quantity, unit_price, price_type || 'normal'])

      // ... (Resto do código de estoque e movements permanece igual)
    }

    await conn.query(`
      UPDATE sales SET total_amount = ?
      WHERE id = ?
    `, [totalAmount, saleId])

    await conn.commit()
    return { message: 'Venda realizada com sucesso', sale_id: saleId, total: totalAmount }
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