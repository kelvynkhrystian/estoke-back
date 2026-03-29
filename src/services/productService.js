import pool from '../config/database.js'

// ============================
// LISTAR TODOS (COM INSUMOS)
// ============================
export const getAllProducts = async () => {
  const [products] = await pool.query(`
    SELECT p.*, c.name AS category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
  `)

  for (const product of products) {
    const [insumos] = await pool.query(`
      SELECT 
        pi.insumo_id,
        pi.quantity,
        i.name,
        i.unit
      FROM product_insumos pi
      JOIN insumos i ON i.id = pi.insumo_id
      WHERE pi.product_id = ?
    `, [product.id])

    product.insumos = insumos
  }

  return products
}

// ============================
// BUSCAR POR ID (COM INSUMOS)
// ============================
export const getProductById = async (id) => {
  const [[product]] = await pool.query(
    'SELECT * FROM products WHERE id = ?',
    [id]
  )

  if (!product) return null

  const [insumos] = await pool.query(`
    SELECT 
      pi.insumo_id,
      pi.quantity,
      i.name,
      i.unit
    FROM product_insumos pi
    JOIN insumos i ON i.id = pi.insumo_id
    WHERE pi.product_id = ?
  `, [id])

  product.insumos = insumos

  return product
}

// ============================
// CRIAR
// ============================
export const createProduct = async (data) => {
  const {
    name,
    sku,
    unit,
    cost_price,
    sale_price,
    resale_price,
    min_stock,
    category_id,
    is_active,
    insumos = []
  } = data

  const [result] = await pool.query(`
    INSERT INTO products 
    (
      name, sku, unit,
      cost_price, sale_price, resale_price,
      min_stock, category_id, is_active
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    name,
    sku,
    unit,
    cost_price || 0,
    sale_price || 0,
    resale_price || 0,
    min_stock || 0,
    category_id,
    is_active ?? 1
  ])

  const productId = result.insertId

  // 🔥 SALVAR INSUMOS
  if (insumos.length > 0) {
    for (const item of insumos) {
      await pool.query(`
        INSERT INTO product_insumos (product_id, insumo_id, quantity)
        VALUES (?, ?, ?)
      `, [productId, item.insumo_id, item.quantity])
    }
  }

  return { id: productId, ...data }
}

// ============================
// UPDATE
// ============================
export const updateProduct = async (id, data) => {
  const {
    name,
    sku,
    unit,
    cost_price,
    sale_price,
    resale_price,
    min_stock,
    category_id,
    is_active,
    insumos = []
  } = data

  await pool.query(`
    UPDATE products SET
      name = ?,
      sku = ?,
      unit = ?,
      cost_price = ?,
      sale_price = ?,
      resale_price = ?,
      min_stock = ?,
      category_id = ?,
      is_active = ?
    WHERE id = ?
  `, [
    name,
    sku,
    unit,
    cost_price || 0,
    sale_price || 0,
    resale_price || 0,
    min_stock || 0,
    category_id,
    is_active ?? 1,
    id
  ])

  // 🔥 REMOVE ANTIGOS
  await pool.query(
    'DELETE FROM product_insumos WHERE product_id = ?',
    [id]
  )

  // 🔥 INSERE NOVOS
  if (insumos.length > 0) {
    for (const item of insumos) {
      await pool.query(`
        INSERT INTO product_insumos (product_id, insumo_id, quantity)
        VALUES (?, ?, ?)
      `, [id, item.insumo_id, item.quantity])
    }
  }

  return { id, ...data }
}

// ============================
// DELETE
// ============================
// export const deleteProduct = async (id) => {
//   await pool.query(
//     'DELETE FROM products WHERE id = ?',
//     [id]
//   )

//   return { message: 'Produto deletado' }
// }

export const deleteProduct = async (id) => {
  const conn = await pool.getConnection()

  try {
    await conn.beginTransaction()

    // 🧹 1. remove do estoque
    await conn.query(
      'DELETE FROM stock WHERE item_id = ? AND item_type = "PRODUCT"',
      [id]
    )

    // 🗑️ 2. remove produto
    await conn.query(
      'DELETE FROM products WHERE id = ?',
      [id]
    )

    await conn.commit()

    return { message: 'Produto deletado com estoque' }

  } catch (error) {
    await conn.rollback()
    throw error
  } finally {
    conn.release()
  }
}