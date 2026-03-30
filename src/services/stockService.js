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
async function updateStock(conn, data) {
  const { item_id, store_id, quantity, type, item_type } = data

  if (!["PRODUCT", "INSUMO"].includes(item_type)) {
    throw new Error("Tipo inválido")
  }

  const id = Number(item_id)
  const qty = Number(quantity)

  // 🔍 pega estoque atual
  const [rows] = await conn.query(`
    SELECT * FROM stock
    WHERE item_id = ? AND store_id = ? AND item_type = ?
  `, [id, store_id, item_type])

  let current = 0

  if (rows.length > 0) {
    current = Number(rows[0].quantity)
  }

  let newQty = current

  if (type === "IN") {
    newQty = current + qty
  }

  if (type === "OUT") {
    if (current < qty) {
      throw new Error("Estoque insuficiente")
    }
    newQty = current - qty
  }

  console.log("📊 ESTOQUE:", { item_type, current, qty, newQty })

  if (rows.length > 0) {
    // UPDATE
    await conn.query(`
      UPDATE stock
      SET quantity = ?
      WHERE item_id = ? AND store_id = ? AND item_type = ?
    `, [newQty, id, store_id, item_type])
  } else {
    // INSERT
    await conn.query(`
      INSERT INTO stock (item_id, store_id, item_type, quantity)
      VALUES (?, ?, ?, ?)
    `, [id, store_id, item_type, newQty])
  }

  return newQty
}

// 🔹 INSERE MOVIMENTO
async function insertMovement(conn, data) {
  const {
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
  } = data

  if (!["PRODUCT", "INSUMO"].includes(item_type)) {
    throw new Error("Tipo inválido")
  }

  const id = Number(item_id)

  console.log("🧾 INSERT MOVEMENT:", {
    item_id: id,
    item_type,
    store_id,
    quantity,
    type
  })

  await conn.query(`
    INSERT INTO stock_movements
    (item_id, item_type, store_id, quantity, type, created_by, reason, notes, reference_type, reference_id, balance_after)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    id,
    item_type,
    store_id,
    quantity,
    type,
    created_by,
    reason,
    notes,
    reference_type,
    reference_id || null,
    balance_after
  ])

  console.log("📝 MOVIMENTO INSERIDO")
}

// 🔹 MOVIMENTAÇÃO
export const movimentStock = async (data) => {
  const conn = await pool.getConnection()

  console.log("📦 DADOS RECEBIDOS NO SERVICE:", data)

  try {
    await conn.beginTransaction()

    const newQty = await updateStock(conn, data)

    console.log("📊 NOVO ESTOQUE:", newQty)

    await insertMovement(conn, {
      ...data,
      balance_after: newQty
    })

    console.log("📝 MOVIMENTO INSERIDO")

    await conn.commit()

    return { message: 'Movimentação realizada com sucesso' }

  } catch (error) {
    console.error("❌ ERRO NO SERVICE:", error)

    await conn.rollback()
    throw error
  } finally {
    conn.release()
  }
}



// 🔥 TRANSFERÊNCIA (FUNCIONA PRA PRODUTOS E INSUMOS)

export const transferStock = async (data) => {
  const conn = await pool.getConnection()

  try {
    await conn.beginTransaction()

    const {
      to_store_id,
      items,
      item_type,
      notes
    } = data


    // 🔥 1. cria transferência
    const [transferResult] = await conn.query(`
      INSERT INTO stock_transfers
      (from_store_id, to_store_id, status, created_by, notes, created_at, updated_at)
      VALUES (?, ?, 'COMPLETED', ?, ?, NOW(), NOW())
    `, [
      from_store_id,
      to_store_id,
      1,
      notes
    ])

    const transferId = transferResult.insertId

    // 🔥 2. processa cada item
    for (const item of items) {
      const { item_id, quantity } = item

      // 🔻 origem
      const [[originStock]] = await conn.query(`
        SELECT * FROM stock
        WHERE item_id = ? AND item_type = ? AND store_id = ?
      `, [item_id, item_type, from_store_id])

      if (!originStock || originStock.quantity < quantity) {
        throw new Error("Estoque insuficiente na origem")
      }

      // 🔻 desconta origem
      await conn.query(`
        UPDATE stock
        SET quantity = quantity - ?, updated_at = NOW()
        WHERE id = ?
      `, [quantity, originStock.id])

      // 🔺 destino
      const [[destStock]] = await conn.query(`
        SELECT * FROM stock
        WHERE item_id = ? AND item_type = ? AND store_id = ?
      `, [item_id, item_type, to_store_id])

      if (destStock) {
        await conn.query(`
          UPDATE stock
          SET quantity = quantity + ?, updated_at = NOW()
          WHERE id = ?
        `, [quantity, destStock.id])
      } else {
        // cria estoque na loja destino
        await conn.query(`
          INSERT INTO stock (store_id, item_id, item_type, quantity, created_at, updated_at)
          VALUES (?, ?, ?, ?, NOW(), NOW())
        `, [to_store_id, item_id, item_type, quantity])
      }

      // 🔥 salva item da transferência
      await conn.query(`
        INSERT INTO stock_transfer_items
        (transfer_id, item_id, quantity_sent, quantity_received, created_at, updated_at)
        VALUES (?, ?, ?, ?, NOW(), NOW())
      `, [transferId, item_id, quantity, quantity])

      // 🔥 registra histórico (SAÍDA)
      await conn.query(`
        INSERT INTO stock_movements
        (item_id, store_id, type, quantity, reason, notes, created_by, created_at, updated_at)
        VALUES (?, ?, 'OUT', ?, 'TRANSFER', ?, ?, NOW(), NOW())
      `, [item_id, from_store_id, quantity, notes, 1])

      // 🔥 histórico (ENTRADA)
      await conn.query(`
        INSERT INTO stock_movements
        (item, store_id, type, quantity, reason, notes, created_by, created_at, updated_at)
        VALUES (?, ?, 'IN', ?, 'TRANSFER', ?, ?, NOW(), NOW())
      `, [item_id, to_store_id, quantity, notes, 1])
    }

    await conn.commit()

    return { message: "Transferência realizada com sucesso" }

  } catch (error) {
    await conn.rollback()
    console.error(error)
    throw error
  } finally {
    conn.release()
  }
}