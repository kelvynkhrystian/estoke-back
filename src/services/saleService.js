import pool from '../config/database.js'

// CRIAR VENDA
export const createSale = async ({ items, store_id, created_by }) => {
  const conn = await pool.getConnection()

  try {
    await conn.beginTransaction()

    // 1. cria venda
    const [saleResult] = await conn.query(`
      INSERT INTO sales (store_id, created_by, total_amount)
      VALUES (?, ?, 0)
    `, [store_id, created_by])

    const saleId = saleResult.insertId

    let totalAmount = 0

    // 2. processa itens
    for (const item of items) {
      const { product_id, quantity, unit_price } = item

      // validação básica
      if (!product_id || !quantity || !unit_price) {
        throw new Error('Item inválido')
      }

      // soma total
      totalAmount += quantity * unit_price

      // salva item
      await conn.query(`
        INSERT INTO sale_items (sale_id, product_id, quantity, unit_price)
        VALUES (?, ?, ?, ?)
      `, [saleId, product_id, quantity, unit_price])

      // busca estoque por loja 🔥
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

      // atualiza estoque
      await conn.query(`
        UPDATE stock SET quantity = ?
        WHERE product_id = ? AND store_id = ?
      `, [newQty, product_id, store_id])

      // registra movimento 🔥
      await conn.query(`
        INSERT INTO stock_movements 
        (product_id, store_id, quantity, type, created_by, reference_type, reference_id)
        VALUES (?, ?, ?, 'OUT', ?, 'SALE', ?)
      `, [product_id, store_id, quantity, created_by, saleId])
    }

    // 3. atualiza total da venda
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