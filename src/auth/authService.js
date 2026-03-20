import pool from '../config/database.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const SECRET = 'seu_segredo_super_forte'

// LOGIN
export const login = async ({ email, password }) => {
  const [rows] = await pool.query(
    'SELECT * FROM users WHERE email = ? AND is_active = 1',
    [email]
  )

  if (rows.length === 0) {
    throw new Error('Usuário não encontrado')
  }

  const user = rows[0]

  // ⚠️ TEMPORÁRIO (porque sua senha está sem hash)
  const isMatch = password === user.password_hash

  // 🔒 depois você troca pra bcrypt.compare

  if (!isMatch) {
    throw new Error('Senha inválida')
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
      store_id: user.store_id
    },
    SECRET,
    { expiresIn: '1d' }
  )

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      role: user.role
    }
  }
}