import pool from '../config/database.js'

// 🔹 BUSCAR ESTOQUE (UNIFICADO)
export const getStock = async (store_id, type) => {
  let query = `
    SELECT 
      s.item_id,
      s.item_type,
      s.quantity,
      st.name AS store_name,

      CASE 
        WHEN s.item_type = 'PRODUCT' THEN p.name
        WHEN s.item_type = 'INSUMO' THEN i.name
      END AS name,

      CASE 
        WHEN s.item_type = 'PRODUCT' THEN p.sku
        ELSE '-'
      END AS sku,

      CASE 
        WHEN s.item_type = 'PRODUCT' THEN p.min_stock
        WHEN s.item_type = 'INSUMO' THEN i.min_stock
      END AS min_stock

    FROM stock s
    LEFT JOIN products p 
      ON p.id = s.item_id AND s.item_type = 'PRODUCT'
    LEFT JOIN insumos i 
      ON i.id = s.item_id AND s.item_type = 'INSUMO'
    JOIN stores st ON st.id = s.store_id
    WHERE s.store_id = ?
  `

  const params = [store_id]

  if (type) {
    query += ` AND s.item_type = ?`
    params.push(type)
  }

  const [rows] = await pool.query(query, params)
  return rows
}

// 🔹 BUSCAR MOVIMENTOS (UNIFICADO)
export const getMovements = async (store_id, type) => {
  let query = `
    SELECT 
      sm.*,
      u.name AS user_name,

      CASE 
        WHEN sm.item_type = 'PRODUCT' THEN p.name
        WHEN sm.item_type = 'INSUMO' THEN i.name
      END AS name

    FROM stock_movements sm
    LEFT JOIN products p 
      ON p.id = sm.item_id AND sm.item_type = 'PRODUCT'
    LEFT JOIN insumos i 
      ON i.id = sm.item_id AND sm.item_type = 'INSUMO'
    JOIN users u ON u.id = sm.created_by

    WHERE sm.store_id = ?
  `

  const params = [store_id]

  if (type) {
    query += ` AND sm.item_type = ?`
    params.push(type)
  }

  query += ` ORDER BY sm.created_at DESC`

  const [rows] = await pool.query(query, params)
  return rows
}

// 🔹 ATUALIZA ESTOQUE
const updateStock = async (conn, { item_id, store_id, quantity, type }) => {
  const [rows] = await conn.query(
    `SELECT * FROM stock WHERE item_id = ? AND store_id = ?`,
    [item_id, store_id]
  )

  let currentQty = rows.length ? rows[0].quantity : 0

  const newQty =
    type === 'IN'
      ? currentQty + quantity
      : type === 'OUT'
      ? currentQty - quantity
      : quantity

  if (newQty < 0) throw new Error('Estoque insuficiente')

  if (rows.length === 0) {
    await conn.query(`
      INSERT INTO stock (item_id, item_type, store_id, quantity)
      VALUES (?, ?, ?, ?)
    `, [item_id, 'PRODUCT', store_id, newQty])
  } else {
    await conn.query(`
      UPDATE stock
      SET quantity = ?
      WHERE item_id = ? AND store_id = ?
    `, [newQty, item_id, store_id])
  }

  return newQty
}

// 🔹 INSERE MOVIMENTO
const insertMovement = async (conn, data) => {
  const {
    item_id,
    store_id,
    quantity,
    type,
    created_by,
    reason,
    notes,
    reference_type,
    reference_id,
    balance_after,
    item_type
  } = data

  await conn.query(`
    INSERT INTO stock_movements
    (item_id, item_type, store_id, quantity, type, created_by, reason, notes, reference_type, reference_id, balance_after)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    item_id,
    item_type,
    store_id,
    quantity,
    type,
    created_by,
    reason,
    notes,
    reference_type,
    reference_id,
    balance_after
  ])
}

// 🔹 MOVIMENTAÇÃO
export const movimentStock = async (data) => {
  const conn = await pool.getConnection()

  try {
    await conn.beginTransaction()

    const newQty = await updateStock(conn, data)

    await insertMovement(conn, {
      ...data,
      balance_after: newQty
    })

    await conn.commit()

    return { message: 'Movimentação realizada com sucesso' }

  } catch (error) {
    await conn.rollback()
    throw error
  } finally {
    conn.release()
  }
}

// 🔥 TRANSFERÊNCIA (FUNCIONA PRA PRODUTOS E INSUMOS)
export const transferStock = async ({
  from_store_id,
  to_store_id,
  items,
  created_by,
  notes,
  item_type = 'PRODUCT'
}) => {
  const conn = await pool.getConnection()

  try {
    await conn.beginTransaction()

    const [transfer] = await conn.query(`
      INSERT INTO stock_transfers
      (from_store_id, to_store_id, created_by, notes)
      VALUES (?, ?, ?, ?)
    `, [from_store_id, to_store_id, created_by, notes])

    const transfer_id = transfer.insertId

    for (const item of items) {
      const { item_id, quantity } = item

      const newQtyOrigin = await updateStock(conn, {
        item_id,
        store_id: from_store_id,
        quantity,
        type: 'OUT',
        item_type
      })

      await insertMovement(conn, {
        item_id,
        store_id: from_store_id,
        quantity,
        type: 'OUT',
        created_by,
        reason: 'TRANSFER',
        reference_type: 'TRANSFER',
        reference_id: transfer_id,
        balance_after: newQtyOrigin,
        item_type
      })

      const newQtyDest = await updateStock(conn, {
        item_id,
        store_id: to_store_id,
        quantity,
        type: 'IN',
        item_type
      })

      await insertMovement(conn, {
        item_id,
        store_id: to_store_id,
        quantity,
        type: 'IN',
        created_by,
        reason: 'TRANSFER',
        reference_type: 'TRANSFER',
        reference_id: transfer_id,
        balance_after: newQtyDest,
        item_type
      })
    }

    await conn.commit()

    return { message: 'Transferência realizada com sucesso' }

  } catch (error) {
    await conn.rollback()
    throw error
  } finally {
    conn.release()
  }
}