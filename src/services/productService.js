import pool from '../config/database.js'

// LISTAR COM CATEGORY (JOIN 🔥)
export const getAllProducts = async () => {
  const [rows] = await pool.query(`
    SELECT 
      p.*, 
      c.name AS category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
  `)

  return rows
}

// BUSCAR POR ID
export const getProductById = async (id) => {
  const [rows] = await pool.query(
    'SELECT * FROM products WHERE id = ?',
    [id]
  )

  return rows[0]
}

// CRIAR
export const createProduct = async (data) => {
  const {
    name,
    sku,
    unit,
    cost_price,
    sale_price,
    min_stock,
    category_id
  } = data

  const [result] = await pool.query(`
    INSERT INTO products 
    (name, sku, unit, cost_price, sale_price, min_stock, category_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [name, sku, unit, cost_price, sale_price, min_stock, category_id])

  return { id: result.insertId, ...data }
}

// UPDATE
export const updateProduct = async (id, data) => {
  const {
    name,
    sku,
    unit,
    cost_price,
    sale_price,
    min_stock,
    category_id
  } = data

  await pool.query(`
    UPDATE products SET
      name = ?,
      sku = ?,
      unit = ?,
      cost_price = ?,
      sale_price = ?,
      min_stock = ?,
      category_id = ?
    WHERE id = ?
  `, [name, sku, unit, cost_price, sale_price, min_stock, category_id, id])

  return { id, ...data }
}

// DELETE
export const deleteProduct = async (id) => {
  await pool.query('DELETE FROM products WHERE id = ?', [id])
  return { message: 'Produto deletado' }
}