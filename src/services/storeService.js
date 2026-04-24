import pool from '../config/database.js'

// 🔍 LISTAR LOJAS (ATIVAS + CONTAGEM DE USUÁRIOS)
export const getStores = async () => {
  const [rows] = await pool.query(`
    SELECT 
      s.id,
      s.name,
      s.is_active,
      COUNT(u.id) AS total_users
    FROM stores s
    LEFT JOIN users u ON u.store_id = s.id AND u.is_active = 1
    GROUP BY s.id
    ORDER BY s.id ASC
  `)

  return rows
}

// 🔍 BUSCAR POR ID
export const getStoreById = async (id) => {
  const [rows] = await pool.query(
    'SELECT * FROM stores WHERE id = ? AND is_active = 1',
    [id]
  )

  return rows[0] || null
}

// ➕ CRIAR LOJA
export const createStore = async ({ name, is_active }) => {
  const [result] = await pool.query(
    'INSERT INTO stores (name, is_active) VALUES (?, ?)',
    [name, is_active]
  )

  return {
    id: result.insertId,
    name,
    is_active,
    total_users: 0
  }
}

// ✏️ ATUALIZAR LOJA
export const updateStore = async (id, { name, is_active }) => {
  const [result] = await pool.query(
    'UPDATE stores SET name = ?, is_active = ? WHERE id = ?',
    [name, is_active, id]
  )

  if (result.affectedRows === 0) return null

  return { id, name, is_active }
}

export const removeStore = async (id) => {
  const connection = await pool.getConnection(); // Pegamos uma conexão para usar transação
  
  try {
    await connection.beginTransaction();

    // 1. Deletar ou desvincular dependências primeiro
    // Exemplo: deletando usuários vinculados a essa loja
    await connection.query('DELETE FROM users WHERE store_id = ?', [id]);
    
    // 2. Agora sim, deleta a loja
    const [result] = await connection.query('DELETE FROM stores WHERE id = ?', [id]);

    await connection.commit();

    if (result.affectedRows === 0) return null;
    return { id };

  } catch (error) {
    await connection.rollback();
    throw error; // Lança o erro para o Controller pegar o 500
  } finally {
    connection.release();
  }
}